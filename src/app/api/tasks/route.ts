import { Task, TaskStatus } from "@prisma/client";
import { prismaClient } from "../../../../prisma/prismaClient";
import { IFormDataCreateTask } from "../../../types/types";
// import { useUserId } from "@/hooks/useUser";

export async function GET(req: Request) {
    try {

        const url = new URL(req.url)
        const status = url.searchParams.get('status') as TaskStatus
        const startDate = url.searchParams.get('startDate')
        const endDate = url.searchParams.get('endDate')

        const whereClause: { updatedAt?: { gte?: Date; lte?: Date }, status?: TaskStatus } = {};
    
        if (status) {
            whereClause.status = status; 
        }

        if (startDate) {
            whereClause.updatedAt = {
                gte: new Date(startDate)
            };
        }

        if (endDate) {
            const endDateObj = new Date(endDate);
            endDateObj.setHours(23, 59, 59, 999); // Устанавливаем время на конец дня
            whereClause.updatedAt = {
                ...whereClause.updatedAt,
                lte: endDateObj
            };
        }



        const tasks = await prismaClient.task.findMany({
            where: whereClause,
            orderBy: [
                { status: 'asc' },
                { updatedAt: 'desc' }
            ]
        })

        return new Response(JSON.stringify(tasks
            //     .sort((a, b) => {
            //     if (a.status === 'new' && b.status !== 'new') {
            //         return -1
            //     }
            //     if (a.status !== 'new' && b.status === 'new') {
            //         return 1
            //     }
            //     return 0
            // })
        ),
            // tasks.sort((a, b) => {
            //     return b.updatedAt.getTime() - a.updatedAt.getTime()
            // })), 
            {
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

        // const { data: useridSession } = useUserId()


        // const userId = newTask.userId


        // if (userId !== useridSession) {
        //     throw new Response(JSON.stringify({ error: "Unauthorized userId" }), {
        //         status: 403,
        //         headers: { "Content-Type": "application/json" }
        //     });
        // }

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

