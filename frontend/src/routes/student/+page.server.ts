import { db } from "$lib/server/db";
import { getStudent } from "$lib/server/db/dbUtils.js";
import { studentTable, sessionTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types.js";
import { validateSessionToken } from "$lib/auth.js";

export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get("session")
    if (token === undefined) {
        redirect(307, "/")
    }
    const { session, user } = await validateSessionToken(token)
    const userID = user!.id
    const student = await getStudent(userID)
    if (!student) {
        redirect(307, "/admin")
    }
    const sessions = await db
        .select()
        .from(sessionTable)
        .where(eq(sessionTable.studentId, student.id))

    return {
        student,
        sessions
    }
}

export const actions = {
    addSession: async ({ request, url }) => {
        const data = await request.formData()
        const userID = Number(url.searchParams.get("userID") ?? "2")
        const student: any = await getStudent(userID)

        const date = data.get("sessionDate")?.toString() ?? ""
        const topics = data.get("topics")?.toString() ?? ""
        const notes = data.get("notes")?.toString() ?? ""

        await db
            .insert(sessionTable)
            .values({
                studentId: student.id,
                subject: student.subjects[0],
                date: date,
                durationMinutes: 90,
                topics: topics,
                notes: notes
            })
    }
}