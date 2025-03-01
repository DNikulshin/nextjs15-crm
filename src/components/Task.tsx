import { Task } from "@prisma/client"
import { Select } from "./Select"
import { formatDate } from "../shared/utils/formatDate"
import { removeTask, updateTask } from "../hooks/useTasks"
import { FocusEventHandler, useState } from "react"

export const TaskItem = ({ task, idx }: { task: Task, idx: number }) => {

    const [title, setTitle] = useState(task.title)
    const [description, setDescription] = useState(task.description ?? 'not filled')

    const deleteTask = removeTask()
    const updateTaskById = updateTask()


    const onBlurTitleHandler = () => {

        if (title?.trim() && title?.trim() !== task.title?.trim()) {
            updateTaskById.mutate(
                {
                    ...task,
                    title,
                    updatedAt: new Date(new Date().toISOString())
                }
            )

        }
    }

    const onBlurDescriptionHandler = () => {

        if (description?.trim() && description?.trim() !== task.description?.trim()) {
            updateTaskById.mutate(
                {
                    ...task,
                    description,
                    updatedAt: new Date(new Date().toISOString())
                }
            )

        }
    }


    if (deleteTask.isPending) {
        return <div className="w-full flex justify-center items-center">Delete Task...</div>
    }

    return (
        <div key={task.id} className="flex flex-col py-2 px-4 justify-between  bg-slate-700/85 break-words gap-3 relative">
            <span> Title:  </span>
            <input
                className="border px-2 py-1"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                onBlur={onBlurTitleHandler}

            />

            <span>Description:</span>
            <textarea
                className="border px-2 py-1 min-h-fit"
                onChange={(e) => setDescription(e.target.value)}
                value={description ?? 'not filled'}

                onBlur={onBlurDescriptionHandler}

            />

            <div className="flex gap-2  ">
                <span>Status:</span>
                <Select task={task} key={idx} />
            </div>
            <div>UpdatedAt: {formatDate({ date: task.updatedAt })}</div>
            <button
                className="text-white items-center flex justify-center absolute right-5 bg-red-500 px-2  disabled:bg-gray-400"
                onClick={() => deleteTask.mutate(task.id)}

                disabled={deleteTask.isPending && updateTaskById.isPending}
            >
                x
            </button>
        </div>
    )
}