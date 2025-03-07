import { Task } from '@prisma/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { IFormDataCreateTask } from '../types/types'


interface ResponseData {
    tasks: Task[],
    user?: { id: string, email: string } 
    totalCount: number
}

const fetcTasks = async ({ status, startDate, endDate }: { status?: string, startDate?: string, endDate?: string }): Promise<ResponseData> => {
    try {

        const params = new URLSearchParams({
            ...(status ? { status } : {}),
            ...(startDate ? { startDate } : {}),
            ...(endDate ? { endDate } : {})
        });

        const response = await fetch(`/api/tasks?${params.toString()}`);


        return await response.json() as ResponseData

    } catch (error) {

        throw error
    }

}

const create = async (task: IFormDataCreateTask, signal: AbortSignal): Promise<Task> => {
    try {
        const response = await fetch('/api/tasks', {
            method: "POST",
            body: JSON.stringify(task),
            signal
        })
        return await response.json()

    } catch (error) {
        throw error
    }
}


const remove = async (id: string, signal: AbortSignal): Promise<{ id: string }> => {
    try {
        const response = await fetch('/api/tasks', {
            method: "DELETE",
            body: JSON.stringify(id),
            signal
        })

        return await response.json()

    } catch (error) {
        throw error
    }
}

const update = async (task: Task, signal: AbortSignal): Promise<{ id: string }> => {
    try {
        const response = await fetch('/api/tasks', {
            method: "PATCH",
            body: JSON.stringify(task),
            signal
        })

        return await response.json()
    } catch (error) {
        throw error
    }
}

const useRemoveTask = () => {
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
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        }
    })
}

const useTasks = ({ status, startDate, endDate }: { status?: string, startDate?: string, endDate?: string }) => {

    return useQuery({
        queryKey: ['tasks', status, startDate, endDate],
        queryFn: () => fetcTasks({ status, startDate, endDate }),
        refetchInterval: 60000
    })
}

const useUpdateTask = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (task: Task) => {
            const controller = new AbortController()
            const signal = controller.signal
            const mutation = update(task, signal)
            try {
                return await mutation;
            } finally {
                return controller.abort();
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        }
    })
}

const useCreateNewTask = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (task: IFormDataCreateTask) => {
            const controller = new AbortController()
            const signal = controller.signal
            const mutation = create(task, signal)
            try {
                return await mutation;
            } finally {
                return controller.abort();
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        }
    })
}

export { useTasks, useCreateNewTask, useUpdateTask, useRemoveTask }
