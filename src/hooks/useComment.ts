import { IDataComment, IFormDataCreateComment } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


const fetchComments = async ({ taskId = '', userId = '' }: { taskId?: string, userId?: string }): Promise<Comment[]> => {

    const params = new URLSearchParams({
        ...(taskId ? { taskId } : {}),
        ...(userId ? { userId } : {}),

    });

    try {
        const response = await fetch(`/api/comments?${params.toString()}`);

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

const remove = async (id: string, signal: AbortSignal): Promise<{ id: string }> => {
    try {
        const response = await fetch('/api/comments', {
            method: "DELETE",
            body: JSON.stringify(id),
            signal
        })

        return await response.json()

    } catch (error) {
        throw error
    }
}

const useComments = ({ taskId, userId }: { taskId?: string, userId?: string }) => {

    return useQuery({
        queryKey: ['comments'],
        queryFn: () => fetchComments({ taskId, userId })
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
            queryClient.invalidateQueries({ queryKey: ['comments'] });
            queryClient.invalidateQueries({ queryKey: ['tasks'] });


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
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    })
}

const useRemoveComment = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const controller = new AbortController()
            const signal = controller.signal
            const mutation = remove(id, signal)
            try {
                return await mutation;
            } finally {
                return controller.abort();
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['comments'] })
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    })
}

export { useComments, useCreateNewComment, useUpdateComment, useRemoveComment }
