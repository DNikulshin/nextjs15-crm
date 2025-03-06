import { Task } from '@prisma/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { IFormDataCreateTask } from '../types/types'

const fetcTasks = async ({ status, startDate, endDate }: { status?: string, startDate?: string, endDate?: string }): Promise<Task[] & { user?: { id: string, email: string } }> => {
    try {

        const params = new URLSearchParams({
            ...(status ? { status } : {}),
            ...(startDate ? { startDate } : {}),
            ...(endDate ? { endDate } : {})
        });

        const response = await fetch(`/api/tasks?${params.toString()}`);

        // const response = await fetch(`/api/tasks${status ? `?status=${status}` : ''}${startDate ? `?startDate=${startDate}` : ''}${endDate ? `?endDate=${endDate}` : ''} `)

        return await response.json()

    } catch (error) {

        throw error
    }

}

const create = async (task: IFormDataCreateTask): Promise<Task> => {
    try {
        const response = await fetch('/api/tasks', {
            method: "POST",
            body: JSON.stringify(task)
        })
        return await response.json()

    } catch (error) {

        throw error
    }
}

const remove = async (id: string): Promise<{ id: string }> => {

    try {
        const response = await fetch('/api/tasks', {
            method: "DELETE",
            body: JSON.stringify(id)
        })

        return await response.json()

    } catch (error) {

        throw error
    }
}

const update = async (task: Task): Promise<{ id: string }> => {
    try {
        const response = await fetch('/api/tasks', {
            method: "PATCH",
            body: JSON.stringify(task)
        })

        return await response.json()
    } catch (error) {

        throw error
    }

}

const useRemoveTask = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: remove,
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        }
    })

}

const useTasks = ({ status, startDate, endDate }: { status?: string, startDate?: string, endDate?: string }) => {

    return useQuery({
        queryKey: ['tasks', status, startDate, endDate],
        queryFn: () => fetcTasks({ status, startDate, endDate }),

    })
}

const useUpdateTask = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: update,
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        }
    })

}

const useCreateNewTask = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: create,
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        }
    })

}

export { useTasks, useCreateNewTask, useUpdateTask, useRemoveTask }
