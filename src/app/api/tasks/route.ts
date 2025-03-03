import { Task, TaskStatus } from "@prisma/client";
import { prismaClient } from "../../../../prisma/prismaClient";
import { IFormDataCreateTask } from "../../../types/types";
import { format, parseISO } from 'date-fns'

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
            const parsedDate = parseISO(startDate);
            const outputDate = format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
            const startOfDay = new Date(outputDate);
            const endOfDay = new Date(startOfDay);
            endOfDay.setHours(23, 59, 59, 999);

            whereClause.updatedAt = {
                gte: startOfDay,
                lte: endOfDay
            };
        }

        if (startDate && endDate) {
            const parsedStartDate = parseISO(startDate);
            const outputStartDate = format(parsedStartDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

            whereClause.updatedAt = {
                gte: new Date(outputStartDate)
            };

            const parsedEndDate = parseISO(endDate);
            const outputEndDate = format(parsedEndDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

            whereClause.updatedAt.lte = new Date(outputEndDate);
        }


        console.log(whereClause);


        const tasks = await prismaClient.task.findMany({
            where: whereClause,
            orderBy: [
                { updatedAt: 'asc' },
                { status: 'desc' }
            ]
        });

        return new Response(JSON.stringify(tasks), {
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

        const updateTask: Task = await req.json()

        const task = await prismaClient.task.update({
            where: {
                id: updateTask.id
            },
            data: { ...updateTask }
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

        const taskId: string = await req.json()

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

