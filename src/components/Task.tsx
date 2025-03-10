import { Task } from "@prisma/client"
import { Select } from "./Select"
import { formatDate } from "../shared/utils/formatDate"
import { useRemoveTask, useUpdateTask } from "../hooks/useTask"
import { useState } from "react"
import { CustomConfirm } from "./CustomConfirm"


interface Props {
    idx: number
    userId: string,
    task: Task & {
        user?: { id: string, email: string }
    }
}

export const TaskItem = ({ idx, task, userId }: Props) => {

    const [title, setTitle] = useState(task.title)
    const [description, setDescription] = useState(task.description ?? 'not filled')
    const [report, setReport] = useState(task.report ?? '')
    const [isConfirmVisible, setConfirmVisible] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState('');
    const [isEditTitle, setIsEditTitle] = useState(false)
    const [isEditDescription, setIsEditDescription] = useState(false)
    const [isEditREport, setIsEditReport] = useState(false)

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
        <div key={task.id} className="flex flex-col pb-2 pt-8 px-4 justify-between bg-slate-700/85 break-words gap-3 relative z-10">
            <div className="flex gap-4">
                <span>Title:</span>
                {(task.userId === userId) &&
                    <button className="text-sm"
                        onClick={() => setIsEditTitle(!isEditTitle)}
                    >
                        {isEditTitle
                            ? <span className="bg-green-500/85  px-2 py-1 rounded-sm">
                                Save
                            </span>
                            : <span className="bg-red-500/85  px-2 py-1 rounded-sm">
                                Edit
                            </span>
                        }
                    </button>}
                <span className="font-bold">{task?.user?.email}</span>
            </div>

            {isEditTitle && <textarea
                className="border px-2 py-1  min-h-fit"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                onBlur={onBlurTitleHandler}

            />}
            <p className="shadow-md px-2 py-2">{title}</p>

            <div className="flex gap-4">
                <span>Description:</span>
                {(task.userId === userId) && <button className="text-sm"
                    onClick={() => setIsEditDescription(!isEditDescription)}
                >
                    {isEditDescription
                        ? <span className="bg-green-500/85  px-2 py-1 rounded-sm">
                            Save
                        </span>
                        : <span className="bg-red-500/85  px-2 py-1 rounded-sm">
                            Edit
                        </span>
                    }
                </button>}

            </div>
            {isEditDescription && <textarea
                className="border px-2 py-1 min-h-fit"
                onChange={(e) => setDescription(e.target.value)}
                value={description ?? 'not filled'}

                onBlur={onBlurDescriptionHandler}

            />}
            <p className="shadow-md px-2 py-2">{description}</p>
            <div className="flex gap-2 shadow-md px-2 pt-2 pb-4">
                <span>Status:</span>
                <Select task={task} key={idx} />
            </div>


            <div className="shadow-md px-2 py-2"><span>UpdatedAt:</span> {formatDate({ date: task.updatedAt })}</div>

            {(task.status !== 'new') &&
                <div className="w-full flex flex-col py-2 justify-between  bg-slate-700/85 break-words gap-2">
                    <div className="flex gap-2 flex-wrap">
                        Report & Comment:
                        <button className="text-sm"
                            onClick={() => setIsEditReport(!isEditREport)}
                        >
                            {isEditREport
                                ? <span className="bg-green-500/85  px-2 py-1 rounded-sm">
                                    Save
                                </span>
                                : <span className="bg-red-500/85  px-2 py-1 rounded-sm">
                                    Edit
                                </span>
                            }
                        </button>
                    </div>
                    {isEditREport && <textarea
                        className="border px-2 py-1 min-h-fit"
                        onChange={(e) => setReport(e.target.value)}
                        value={report}
                        onBlur={onBlurReportHandler}
                    />}

                    <p className="shadow-md px-2 py-2">{report}</p>
                </div>
            }

            {(task.userId === userId) && <button
                className="text-white items-center flex justify-center absolute right-2 top-2 bg-red-500 px-2  disabled:bg-gray-400 cursor-pointer"
                onClick={() => handleDeleteClick(task.id)}
                disabled={deleteTask.isPending && updateTaskById.isPending}
            >
                x
            </button>}
            {isConfirmVisible && (
                <div className={"retative inset-0 bg-black bg-opacity-50 z-10"}

                    onClick={handleCancel}>
                    <CustomConfirm
                        message="Вы уверены, что хотите удалить эту задачу?"
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                    />
                </div>
            )}
        </div>
    )
}