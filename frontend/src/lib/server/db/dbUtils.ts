import { db } from "./index";
import { studentTable } from "./schema";
import { eq } from "drizzle-orm";

export async function getStudent(userID: number) {
    const students = await db
        .select()
        .from(studentTable)
        .where(eq(studentTable.userID, userID))

    if (students.length < 1) { console.log("User not found") }
    const student = students[0]

    return student
}