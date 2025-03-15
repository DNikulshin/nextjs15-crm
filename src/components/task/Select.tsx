import { useState } from "react"
import { useUpdateTask } from "../../hooks/useTask"
import { TaskStatus } from "@prisma/client"
import { Option } from './Option'
import { IDataTask } from "@/types/types"



export const dataTaskStatus = [
    { value: 'new', translate: 'Новая' },
    { value: 'inWork', translate: 'В работе' },
    { value: 'waiting', translate: 'В ожидании' },
    { value: 'cancelled', translate: 'Отменено' },
    { value: 'completed', translate: 'Выполнено' },
    { value: 'inArchive', translate: 'В архиве' },
]


export const Select = ({ task }: { task: IDataTask }) => {

    const [taskStatus, setTaskStatus] = useState(task.status)

    const updateTaskById = useUpdateTask()

    return (
        <select
            className={`rounded-sm cursor-pointer text-center border outline-none ${task.status}`}
            onChange={(e) => {
                if (e.target.value === 'new') return

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