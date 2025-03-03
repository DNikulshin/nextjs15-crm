import { Task } from "@prisma/client"
import { Select } from "./Select"
import { formatDate } from "../shared/utils/formatDate"
import { useRemoveTask, useUpdateTask } from "../hooks/useTask"
import { useState } from "react"
import { CustomConfirm } from "./CustomConfirm"

export const TaskItem = ({ task, idx }: { task: Task, idx: number }) => {

    const [title, setTitle] = useState(task.title)
    const [description, setDescription] = useState(task.description ?? 'not filled')
    const [report, setReport] = useState(task.report ?? '')
    const [isConfirmVisible, setConfirmVisible] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState('');

    const deleteTask = useRemoveTask()
    const updateTaskById = useUpdateTask()


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

    const onBlurReportHandler = () => {

        if (report?.trim() && report?.trim() !== task.report?.trim()) {
            updateTaskById.mutate(
                {
                    ...task,
                    report,
                    updatedAt: new Date(new Date().toISOString())
                }
            )

        }
    }
    const handleDeleteClick = (taskId: string) => {
        setTaskToDelete(taskId);
        setConfirmVisible(true);
    };

    const handleConfirm = () => {
        if (taskToDelete) {
            deleteTask.mutate(taskToDelete);
        }
        setConfirmVisible(false);
        setTaskToDelete('');
    };

    const handleCancel = () => {
        setConfirmVisible(false);
        setTaskToDelete('');
    };

    if (deleteTask.isPending) {
        return <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 loader"></div>
    }

    return (
        <div key={task.id} className="flex flex-col py-2 px-4 justify-between  bg-slate-700/85 break-words gap-3 relative">
            <span> Title:</span>
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

            <div className="flex gap-2">
                <span>Status:</span>
                <Select task={task} key={idx} />
            </div>


            <div><span>UpdatedAt:</span> {formatDate({ date: task.updatedAt })}</div>

            {(task.status !== 'new' && task.status !== 'inWork') &&
                <div className="w-full flex flex-col py-2 justify-between  bg-slate-700/85 break-words gap-2">
                    <span>Report:</span>
                    <textarea
                        className="border px-2 py-1 min-h-fit"
                        onChange={(e) => setReport(e.target.value)}
                        value={report}
                        onBlur={onBlurReportHandler}
                    />
                </div>

            }

            <button
                className="text-white items-center flex justify-center absolute right-5 bg-red-500 px-2  disabled:bg-gray-400"
                onClick={() => handleDeleteClick(task.id)}
                disabled={deleteTask.isPending && updateTaskById.isPending}
            >
                x
            </button>
            {isConfirmVisible && (
                <CustomConfirm
                    message="Вы уверены, что хотите удалить эту задачу?"
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </div>
    )
}