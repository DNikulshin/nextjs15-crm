import { Task } from '@prisma/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserId } from '@/app/login/actions'
// import { IFormDataCreateTask } from '../types/types'
// import { getUserId } from '@/app/login/actions'

const fetchUser = async (id?: string): Promise<Task[]> => {
    try {

        const response = await fetch(`/api/users/${id}`)

        return await response.json()

    } catch (error) {

        throw error
    }
}


// const create = async (task: IFormDataCreateTask): Promise<Task> => {
//     try {
//         const response = await fetch('/api/tasks', {
//             method: "POST",
//             body: JSON.stringify(task)
//         })
//         return await response.json()

//     } catch (error) {

//         throw error
//     }
// }

// const remove = async (id: string): Promise<{ id: string }> => {

//     try {
//         const response = await fetch('/api/tasks', {
//             method: "DELETE",
//             body: JSON.stringify(id)
//         })

//         return await response.json()

//     } catch (error) {

//         throw error
//     }
// }

// const update = async (task: Task): Promise<{ id: string }> => {
//     try {
//         const response = await fetch('/api/tasks', {
//             method: "PATCH",
//             body: JSON.stringify(task)
//         })

//         return await response.json()
//     } catch (error) {

//         throw error
//     }

// }

// const useRemoveUser = () => {
//     const queryClient = useQueryClient()
//     return useMutation({
//         mutationFn: remove,
//         onSettled: () => {
//             queryClient.invalidateQueries({ queryKey: ['tasks'] })
//         }
//     })

// }

const useGetUser = (id?: string) => {
    return useQuery({
        queryKey: ['tasks', id],
        queryFn: () => fetchUser(),

    })
}



// const useUserId = () => {

//     return useQuery({
//         queryKey: ['useId'],
//         queryFn: () => getUserId(),

//     })
// }


// const useUpdateTask = () => {
//     const queryClient = useQueryClient()
//     return useMutation({
//         mutationFn: update,
//         onSettled: () => {
//             queryClient.invalidateQueries({ queryKey: ['tasks'] })
//         }
//     })

// }

// const useCreateNewTask = () => {
//     const queryClient = useQueryClient()
//     return useMutation({
//         mutationFn: create,
//         onSettled: () => {
//             queryClient.invalidateQueries({ queryKey: ['tasks'] })
//         }
//     })

// }


const useUserId = () => {

    return useQuery({
        queryKey: ['useId'],
        queryFn: () => getUserId()
    })
}


export { useUserId }
