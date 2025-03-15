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
    updatedAt: Date
}


export interface ISortedDateTasks {
    startDate?: string
    endDate?: string
}

export interface IDataTask {
    id: string;
    number: number;
    title: string;
    description: string | null;
    status: $Enums.TaskStatus;
    report: string | null;
    updatedAt: Date;
    userId: string;
    taskId: string;
    user?: User
    comments?: IDataComment[]
}

export interface IDataComment {
    id: string;
    content: string
    userId: string
    taskId: string
    user?: User
    updatedAt: Date;
}


export interface ResponseDataTask {
    tasks: IDataTask[]
    totalCount: number

}

export interface User {
    id: string
    email: string
}