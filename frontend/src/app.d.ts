// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

interface Student {
	id: number;
	name: string;
	email?: string;
	phone?: string;
	school?: string;
	level: string;
	subjects: string[];
	notes?: Note[];
	gradeHistory?: GradeRecord[];
	createdAt: Date;
}

export interface Session {
	id: number;
	studentId: number;
	subject: string;
	date: Date;
	durationMinutes: number;
	topics: string[];
	notes?: string[];
	homework?: string;
}

export interface GradeRecord {
  id: number;
  studentId: number;
  subject: string;
  grade: string; // Or use a union type like 'A' | 'B' | 'C' | 'D' | 'F'
  score: number;
  date: Date;
  remarks?: string;
}