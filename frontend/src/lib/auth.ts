import { type User, type Session, userSessionTable, userTable } from "$lib/server/db/schema"
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { db } from "./server/db";
import { eq } from "drizzle-orm";

export function generateSessionToken(): string {
    const bytes = new Uint8Array(20)
    crypto.getRandomValues(bytes)
    const token = encodeBase32LowerCaseNoPadding(bytes)
    return token
}

export async function createSession(token: string, userID: number): Promise<Session> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
    const session: Session = {
        id: sessionId,
        userID,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    }
    await db.insert(userSessionTable).values(session)
    return session
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
    const result = await db
        .select({ user: userTable, session: userSessionTable})
        .from(userSessionTable)
        .innerJoin(userTable, eq(userSessionTable.userID, userTable.id))
        .where(eq(userSessionTable.id, sessionId))
    if (result.length < 1) {
        return { session: null, user: null}
    }

    const { user, session } = result[0]
    if (Date.now() >= session.expiresAt.getTime()) {
        await db.delete(userSessionTable).where(eq(userSessionTable.id, session.id))
        return { session: null, user: null }
    }

    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
        session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
        await db
            .update(userSessionTable)
            .set({
                expiresAt: userSessionTable.expiresAt
            })
            .where(eq(userSessionTable.id, session.id))
    }
    return { session, user }
}

export async function invalidateSession(sessionId: string): Promise<void> {
    await db
        .delete(userSessionTable)
        .where(eq(userSessionTable.id, sessionId))
}

export async function invalidateAllSessions(userId: number): Promise<void> {
    await db
        .delete(userSessionTable)
        .where(eq(userSessionTable.userID, userId))
}

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };