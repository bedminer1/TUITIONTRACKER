import { sqliteTable, integer, text, } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

import type { InferSelectModel } from 'drizzle-orm';

export const userTable = sqliteTable('users', {
	id: integer('id').primaryKey(),
	phoneNumber: text("phone_number").notNull(),
	password: text("password").notNull(),
	isAdmin: integer("isAdmin").notNull(), // 0 or 1
});

export const userSessionTable = sqliteTable("user_sessions", {
  id: text("id").primaryKey(),
  userID: integer("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer("expires_at", {
		mode: "timestamp"
	}).notNull()
})

export type User = InferSelectModel<typeof userTable>
export type Session = InferSelectModel<typeof userSessionTable>

// --- STUDENT ---
export const studentTable = sqliteTable("students", {
  id: integer("id").primaryKey(),
  userID: integer("user_id").references(() => userTable.id),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  school: text("school"),
  level: text("level").notNull(),
  subjects: text("subjects", { mode: "json" }).notNull(), // string[]
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// --- SESSION ---
export const sessionTable = sqliteTable("sessions", {
  id: integer("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => studentTable.id),
  subject: text("subject").notNull(),
  date: text("date").notNull(), // store as ISO string
  durationMinutes: integer("duration_minutes").notNull(),
  topics: text("topics", { mode: "json" }).notNull(), // string[]
  notes: text("notes", { mode: "json" }), // optional string[]
  homework: text("homework"),
});

// --- GRADE RECORD ---
export const gradeRecordTable = sqliteTable("grade_records", {
  id: integer("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => studentTable.id),
  subject: text("subject").notNull(),
  grade: text("grade").notNull(), // could enforce union in app layer
  score: integer("score").notNull(),
  date: text("date").notNull(),
  remarks: text("remarks"),
});