import { IDataComment, IFormDataCreateComment } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


const fetchComments = async (): Promise<Comment[]> => {
    try {
        const response = await fetch(`/api/comments`);

        return await response.json() as Comment[]

    } catch (error) {

        throw error
    }
}

const create = async (comment: IFormDataCreateComment, signal: AbortSignal): Promise<Comment> => {
    try {
        const response = await fetch('/api/comments', {
            method: "POST",
            body: JSON.stringify(comment),
            signal
        })
        return await response.json()

    } catch (error) {
        throw error
    }
}

const update = async (comment: IDataComment, signal: AbortSignal): Promise<Comment> => {
    try {
        const response = await fetch('/api/comments', {
            method: "PATCH",
            body: JSON.stringify(comment),
            signal
        })

        return await response.json()

    } catch (error) {
        throw error
    }
}

const useComments = () => {

    return useQuery({
        queryKey: ['comments'],
        queryFn: () => fetchComments()
    })
}

const useCreateNewComment = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (comment: IFormDataCreateComment) => {
            const controller = new AbortController()
            const signal = controller.signal
            const mutation = create(comment, signal)
            try {
                return await mutation;
            } finally {
                return controller.abort();
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['comments'] })
        }
    })
}

const useUpdateComment = () => {

    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (comment: IDataComment) => {
            const controller = new AbortController()
            const signal = controller.signal
            const mutation = update(comment, signal)
            try {
                return await mutation;
            } finally {
                return controller.abort();
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['comments'] })
        }
    })
}

export { useComments, useCreateNewComment, useUpdateComment }
