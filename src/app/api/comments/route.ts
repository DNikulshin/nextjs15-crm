// import { Comment} from "@prisma/client";
import { IDataComment, IFormDataCreateComment } from "@/types/types";
import { prismaClient } from "../../../../prisma/prismaClient";
import { checkApiKey, createResponse } from "@/shared/utils/checkApiKeyHandler";

export async function GET(req: Request) {
    try {

        if (!await checkApiKey(req)) {
            return createResponse({ message: 'Unauthorized' }, 401);
        }
        

        const url = new URL(req.url);
        const taskId = url.searchParams.get('taskId') ?? undefined
        const userId = url.searchParams.get('userId') ?? undefined

        const totalCommentCount = await prismaClient.comment.count();

        const comments = await prismaClient.comment.findMany({
            where: { taskId, userId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true
                    }
                },
                task: true
            },
            orderBy: [
                { updatedAt: 'desc' }
            ],

        });

        return new Response(JSON.stringify({ comments, totalCount: totalCommentCount }), {
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

        if (!await checkApiKey(req)) {
            return createResponse({ message: 'Unauthorized' }, 401);
        }
        
        const newComment: IFormDataCreateComment = await req.json()

        console.log(newComment.updatedAt)

        const comment = await prismaClient.comment.create({
            data: {
                content: newComment.content,
                updatedAt: newComment.updatedAt,
                taskId: newComment.taskId,
                userId: newComment.userId
            },
            select: {
                id: true,
                content: true,
                updatedAt: true,
                taskId: true,
                userId: true
            }
        })

        return new Response(JSON.stringify(comment), {
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
        if (!await checkApiKey(req)) {
            return createResponse({ message: 'Unauthorized' }, 401);
        }
        

        const updateComment: IDataComment = await req.json()

        const task = await prismaClient.comment.update({
            where: {
                id: updateComment.id
            },
            data: {
                content: updateComment.content,
                updatedAt: updateComment.updatedAt
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

        if (!await checkApiKey(req)) {
            return createResponse({ message: 'Unauthorized' }, 401);
        }
        
        const taskId = await req.json()

        const deleteComment = await prismaClient.comment.delete({
            where: {
                id: taskId
            }
        })

        return new Response(JSON.stringify(deleteComment), {
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




