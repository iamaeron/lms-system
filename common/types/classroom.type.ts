import type { ApiResponse } from "./api.type";

export type MembershipRole = "teacher" | "student";

export interface ClassroomMember {
	role: MembershipRole;
	joinedAt: Date;
	classroom: ClassroomResponse;
}

export interface ClassroomResponse {
	id: string;
	name: string;
	section: string | null;
	subjectCode: string | null;
	gradeLevel: number | null;
	description: string | null;
	joinCode: string;
	joinEnabled: boolean;
	archivedAt: Date | null;
	memberCount: number;
	createdAt: Date;
	updatedAt: Date;
	ownerId: string;
	owner: {
		id: string;
		name: string | null;
		image: string | null;
	};
	members?: Array<{
		user: {
			id: string;
			name: string | null;
			image: string | null;
		};
	}>;
	department: {
		id: string;
		name: string;
		description: string | null;
		code: string | null;
	} | null;
}

export type ClassroomListResponse = ApiResponse<ClassroomMember[]>;
export type ClassroomSingleResponse = ApiResponse<ClassroomResponse>;
export type JoinClassroomResponse = ApiResponse<ClassroomResponse>;

export interface ClassroomMembersResponse {
	data: Array<{
		id: string;
		role: MembershipRole;
		joinedAt: Date;
		user: {
			id: string;
			name: string | null;
			image: string | null;
		};
	}>;
}

export interface CreateClassroomInput {
	name: string;
	section?: string;
	subject?: string;
	gradeLevel?: number;
	description?: string;
}

export interface UpdateClassroomInput {
	name?: string;
	section?: string;
	subject?: string;
	gradeLevel?: number;
	description?: string;
	joinEnabled?: boolean;
	archived?: boolean;
}

export interface JoinClassroomInput {
	code: string;
}
