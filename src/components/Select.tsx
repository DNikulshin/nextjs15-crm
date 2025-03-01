import { useState } from "react"
import { updateTask } from "../hooks/useTasks"
import { Task, TaskStatus } from "@prisma/client"
import { Option } from './Option'



export const dataTaskStatus = [
    { value: 'new' },
    { value: 'inWork' },
    { value: 'cancelled' },
    { value: 'completed' },
    { value: 'waiting' }
]


export const Select = ({ task }: { task: Task }) => {

    const [taskStatus, setTaskStatus] = useState(task.status)

    const updateTaskById = updateTask()

    return (
        <select
            className={`rounded-sm cursor-pointer text-center border outline-none ${task.status}`}
            onChange={(e) => {
                const newStatus = e.target.value as TaskStatus

                setTaskStatus(newStatus)
                updateTaskById.mutate(
                    {
                        ...task,
                        status: newStatus,
                        updatedAt: new Date(new Date().toISOString())
                    }
                )
            }}
            value={taskStatus}
        >

            {
                dataTaskStatus.map(item => <Option item={item} key={item.value} />)
            }

        </select>
    )
}