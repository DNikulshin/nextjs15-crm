import { Task, TaskStatus } from "@prisma/client";
import { prismaClient } from "../../../../prisma/prismaClient";
import { IFormDataCreateTask } from "../../../types/types";

export async function GET(req: Request) {
    try {

        const url = new URL(req.url)
        const status = url.searchParams.get('status') as TaskStatus

        const tasks = await prismaClient.task.findMany({
            where: { ...(status && { status }) }
        })

        return new Response(JSON.stringify(
            tasks.sort((a, b) => {
                return b.updatedAt.getTime() - a.updatedAt.getTime()
            })), {
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
                User: true
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
            data: { ...updateTask },
            select: {
                id: true,
                User: true
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

        const taskId: string = await req.json()

        const deleteTask = await prismaClient.task.delete({
            where: {
                id: taskId
            },
            select: {
                id: true,
                User: true
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

