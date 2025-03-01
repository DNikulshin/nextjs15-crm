import { Task, TaskStatus } from '@prisma/client'
import { useQuery} from '@tanstack/react-query'

const fetchPostsStatus = async (status: TaskStatus): Promise<Task[]> => {
    try {
        const response = await fetch(`/api/tasks/status/${status}`)
        return await response.json()

    } catch (error) {

        throw error
    }

}


const useTasksTaskStatus = () => {

    return useQuery({
        queryKey: ['tasks'],
        queryFn: () => fetchPostsStatus,

    })
}






export { useTasksTaskStatus }
