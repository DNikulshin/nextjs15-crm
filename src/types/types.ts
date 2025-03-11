import { $Enums } from "@prisma/client";

export interface IFormDataCreateTask {
    title: string,
    description: string,
    userId?: string | undefined
}

export interface IFormDataCreateComment {
    content: string,
    userId: string,
    taskId: string
}


export interface ISortedDateTasks {
    startDate?: string
    endDate?: string
}

export interface IDataTask {
    id: string;
    title: string;
    description: string | null;
    status: $Enums.TaskStatus;
    report: string | null;
    updatedAt: Date;
}

export interface IDataComment {
    id: string;
    content: string
    userId?: string
    taskId?: string 
    user?: {
        id: string
        email: string
    }
    updatedAt: Date;
}

