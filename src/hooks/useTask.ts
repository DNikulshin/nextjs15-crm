import { Task } from '@prisma/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { IDataTask, IFormDataCreateTask, ResponseDataTask } from '../types/types'
import { fetchInstance } from '@/shared/utils/fetch-instance';

const fetcTasks = async ({ status, startDate, endDate }: { status?: string, startDate?: string, endDate?: string }): Promise<ResponseDataTask> => {
    try {

        const params = new URLSearchParams({
            ...(status ? { status } : {}),
            ...(startDate ? { startDate } : {}),
            ...(endDate ? { endDate } : {})
        });

        return await fetchInstance(`/api/tasks?${params.toString()}`);
    } catch (error) {

        throw error
    }

}

const create = async (task: IFormDataCreateTask, signal: AbortSignal): Promise<Task> => {
    try {
        return await fetchInstance('/api/tasks', {
            method: "POST",
            body: JSON.stringify(task),
            signal
        })

    } catch (error) {
        throw error
    }
}

const update = async (task: IDataTask, signal: AbortSignal): Promise<Task> => {
    try {
        return await fetchInstance('/api/tasks', {
            method: "PATCH",
            body: JSON.stringify(task),
            signal
        })

    } catch (error) {
        throw error
    }
}

const remove = async (id: string, signal: AbortSignal): Promise<{ id: string }> => {
    try {
        return await fetchInstance('/api/tasks', {
            method: "DELETE",
            body: JSON.stringify(id),
            signal
        })

    } catch (error) {
        throw error
    }
}

const useTasks = ({ status, startDate, endDate }: { status?: string, startDate?: string, endDate?: string }) => {

    return useQuery({
        queryKey: ['tasks', status, startDate, endDate],
        queryFn: () => fetcTasks({ status, startDate, endDate }),
        refetchInterval: 60000
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

const useUpdateTask = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (task: IDataTask) => {
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


export { useTasks, useCreateNewTask, useUpdateTask, useRemoveTask }
