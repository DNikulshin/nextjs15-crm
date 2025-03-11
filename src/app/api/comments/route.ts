// import { Comment} from "@prisma/client";
import { IDataComment, IFormDataCreateComment } from "@/types/types";
import { prismaClient } from "../../../../prisma/prismaClient";

export async function GET(req: Request) {
    try {

        const totalCommentCount = await prismaClient.comment.count();

        const comments = await prismaClient.comment.findMany({
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
                { updatedAt: 'asc' }
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
        const newComment: IFormDataCreateComment = await req.json()

        const comment = await prismaClient.comment.create({
            data: { ...newComment },
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


