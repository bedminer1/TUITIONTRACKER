import { db } from "$lib/server/db";
import { studentTable, sessionTable, gradeRecordTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types.js";
import { validateSessionToken } from "$lib/auth.js";

export const load: PageServerLoad = async ({ cookies, parent }) => {
    await parent()
    const token = cookies.get("session")
    const { session, user } = await validateSessionToken(token!)
    const students = await db
            .select()
            .from(studentTable)
            .where(eq(studentTable.userID, user!.id))

        if (students.length < 1) { console.log("User not found") }
        const student = students[0]
    if (!student) {
        redirect(307, "/admin")
    }
    const sessions = await db
        .select()
        .from(sessionTable)
        .where(eq(sessionTable.studentId, student.id))

    const gradeRecords = await db
        .select()
        .from(gradeRecordTable)
        .where(eq(gradeRecordTable.studentId, student.id))

    return {
        student,
        sessions,
        gradeRecords
    }
}

export const actions = {
    addSession: async ({ request, cookies, url }) => {
        const data = await request.formData()
        const token = cookies.get("session")
        const { session, user } = await validateSessionToken(token!)
        const students = await db
            .select()
            .from(studentTable)
            .where(eq(studentTable.userID, user!.id))

        if (students.length < 1) { console.log("User not found") }
        const student = students[0]

        const date = data.get("sessionDate")?.toString() ?? ""
        const topics = data.get("topics")?.toString() ?? ""
        const notes = data.get("notes")?.toString() ?? ""

        await db
            .insert(sessionTable)
            .values({
                studentId: student.id,
                subject: (student.subjects as string[])[0],
                date: date,
                durationMinutes: 90,
                topics: topics,
                notes: notes
            })
    },

    addGradeRecord: async ({ request, cookies }) => {
        const data = await request.formData()
        const token = cookies.get("session")
        const { session, user } = await validateSessionToken(token!)
        const students = await db
            .select()
            .from(studentTable)
            .where(eq(studentTable.userID, user!.id))

        if (students.length < 1) { console.log("User not found") }
        const student = students[0]

        console.log(data, student)
        const marks = Number(data.get("marks"))
        const totalMarks = Number(data.get("totalMarks"))
        const percentageScore = Math.round((marks / totalMarks) * 100 * 2) / 2
        await db
            .insert(gradeRecordTable)
            .values({
                // @ts-ignore
                studentId: student.id,
                subject: (student.subjects as string[])[0],
                grade: data.get("grade") ?? "", // could enforce union in app layer
                marks: marks,
                totalMarks: totalMarks,
                percentageScore: percentageScore,
                date: data.get("date") ?? "",
                remarks: data.get("remarks") ?? ""
            })
    }   
}