import { db } from "$lib/server/db";
import { getStudent } from "$lib/server/db/dbUtils.js";
import { studentTable, sessionTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ url }) => {
    const userID = Number(url.searchParams.get("userID") ?? "2")
    const student = await getStudent(userID)
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