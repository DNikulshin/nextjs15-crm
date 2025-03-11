import { Task, TaskStatus, User } from "@prisma/client";
import { prismaClient } from "../../../../prisma/prismaClient";
import { IDataTask, IFormDataCreateTask } from "../../../types/types";
import { getDateTimeInTimeZone } from "@/shared/utils/getDateTimeInTimeZone ";

//const timeZone = 'Europe/Moscow';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const status = url.searchParams.get('status') as TaskStatus;
        const startDate = url.searchParams.get('startDate');
        const endDate = url.searchParams.get('endDate');

        const whereClause: { updatedAt?: { gte?: Date; lte?: Date }, status?: TaskStatus } = {};

        if (status) {
            whereClause.status = status;
        }

        if (startDate && !endDate) {
            const startOfDay = new Date(startDate);
            const endOfDay = new Date(startDate);

            startOfDay.setHours(0, 0, 0, 0);

            endOfDay.setHours(23, 59, 59, 999);

            const formatStartDate = getDateTimeInTimeZone(startOfDay, 'Europe/Moscow')

            const formatEndDate = getDateTimeInTimeZone(endOfDay, 'Europe/Moscow')

            whereClause.updatedAt = {
                gte: new Date(formatStartDate)
                ,
                lte: new Date(formatEndDate)
            };
        }

        if (startDate && endDate) {

            const startOfDay = new Date(startDate);
            const endOfDay = new Date(endDate);

            startOfDay.setHours(0, 0, 0, 0);

            endOfDay.setHours(23, 59, 59, 999);

            const formatStartDate = getDateTimeInTimeZone(startOfDay, 'Europe/Moscow')

            const formatEndDate = getDateTimeInTimeZone(endOfDay, 'Europe/Moscow')

            whereClause.updatedAt = {
                gte: new Date(formatStartDate)
                ,
                lte: new Date(formatEndDate)
            };
        }

        const totalTasksCount = await prismaClient.task.count();

        const tasks = await prismaClient.task.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true
                    }
                },
                comments: {
                    select: {
                        id: true,
                        content: true,
                        updatedAt: true,
                        userId: true,
                        taskId: true,
                        user: {
                            select: {
                                id: true,
                                email: true
                            }
                        }
                    }
                }

            },
            orderBy: [
                { status: 'asc' },
                { updatedAt: 'desc' }
            ],

        });

        return new Response(JSON.stringify({ tasks, totalCount: totalTasksCount }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        throw new Response(JSON.stringify(error), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export async function POST(req: Request) {
    try {
        const newTask: IFormDataCreateTask = await req.json()

        const task = await prismaClient.task.create({
            data: { ...newTask },
            select: {
                title: true,
                description: true,
                status: true,
                updatedAt: true,
                userId: true
            }
        })

        return new Response(JSON.stringify(task), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        })


    } catch (error) {

        throw new Response(JSON.stringify(error), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })

    }
}

export async function PATCH(req: Request) {
    try {

        const updateTask: IDataTask = await req.json()


        const task = await prismaClient.task.update({
            where: {
                id: updateTask.id
            },
            data: {
                title: updateTask.status,
                description: updateTask.description,
                report: updateTask.report,
                status: updateTask.status,
                updatedAt: updateTask.updatedAt
            }
        })

        return new Response(JSON.stringify(task), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        })


    } catch (error) {

        throw new Response(JSON.stringify(error), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })

    }
}

export async function DELETE(req: Request) {
    try {

        const taskId = await req.json()

        const deleteTask = await prismaClient.task.delete({
            where: {
                id: taskId
            }
        })

        return new Response(JSON.stringify(deleteTask), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        })


    } catch (error) {

        throw new Response(JSON.stringify(error), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })

    }
}

