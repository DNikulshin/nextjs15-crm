import { Select } from "./Select"
import { CommentList } from "../comment/CommentList"
import { formatDate } from "../../shared/utils/formatDate"
import { useRemoveTask, useUpdateTask } from "../../hooks/useTask"
import { useState } from "react"
import { CustomConfirm } from "./CustomConfirm"
import { FaEdit } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { TiMessages } from "react-icons/ti"
import { MdUpdate } from "react-icons/md";
import { IDataTask } from "@/types/types"
import { Loader } from "@/shared/ui/Loader"

interface Props {
    idx: number
    userId: string,
    task: IDataTask
}

export const TaskItem = ({ idx, task, userId }: Props) => {

    const [title, setTitle] = useState(task.title)
    const [description, setDescription] = useState(task.description ?? '[не заполнено]')
    const [report, setReport] = useState(task.report ?? '')
    const [isConfirmVisible, setConfirmVisible] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState('');
    const [isEditTitle, setIsEditTitle] = useState(false)
    const [isEditDescription, setIsEditDescription] = useState(false)
    const [isEditREport, setIsEditReport] = useState(false)
    const [isVisibleCommets, setisVisibleComments] = useState(false)

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
        return <Loader />
    }

    return (
        <div key={task.id} className="flex flex-col pb-2 pt-8 px-4 justify-between bg-slate-700/85 gap-3 relative z-10">
            <span className="px-2">#{task?.number}</span>
            <span className="flex font-bold items-center gap-2 px-2 py-2 shadow-md">
                <span className="text-lg"><FaUserAlt /></span>
                <span className="text-ellipsis overflow-hidden">
                    {task?.user?.email}
                </span>
            </span>
            <div className="flex flex-wrap  shadow-md px-2 py-1">
                <div className="flex items-center gap-4">
                    <span>Тема:</span>
                    {(task.userId === userId) &&
                        <button className="text-sm"
                            onClick={() => setIsEditTitle(!isEditTitle)}
                        >
                            {isEditTitle
                                ? <span className="text-green-500/85  px-2 py-1 cursor-pointer  flex items-center">
                                    <FaSave className="text-xl" />
                                </span>
                                : <span className="text-red-500/85  px-2 py-1 cursor-pointer flex items-center">
                                    <FaEdit className="text-xl" />
                                </span>
                            }
                        </button>}

                </div>

                {isEditTitle &&
                    <textarea
                        className="border px-2 py-1  min-h-fit w-full"
                        onChange={(e) => setTitle(e.target.value)}
                        spellCheck
                        value={title}
                        onBlur={onBlurTitleHandler}

                    />}
                <p className="px-2 py-2 word-break">{title}</p>
            </div>


            <div className="flex flex-wrap shadow-md  px-2 py-1">
                <div className="flex gap-4 items-center">
                    <span>Описание:</span>
                    {(task.userId === userId) && <button className="text-sm"
                        onClick={() => setIsEditDescription(!isEditDescription)}
                    >
                        {isEditDescription
                            ? <span className="text-green-500/85  px-2 py-1 cursor-pointer  flex items-center  shadow-sm">
                                <FaSave className="text-xl" />
                            </span>
                            : <span className="text-red-500/85  px-2 py-1 cursor-pointer flex items-center  shadow-sm">
                                <FaEdit className="text-xl" />
                            </span>
                        }
                    </button>}

                </div>
                {isEditDescription &&
                    <textarea
                        className="border px-2 py-1 min-h-fit w-full"
                        onChange={(e) => setDescription(e.target.value)}
                        spellCheck
                        value={description ?? 'not filled'}

                        onBlur={onBlurDescriptionHandler}

                    />}
                <p className="px-2 py-2 word-break">{description}</p>
            </div>

            <div className="flex gap-2 shadow-md px-2 pt-2 pb-4">
                <span>Статус:</span>
                <Select task={task} key={idx} />
            </div>


            <div className="flex justify-between items-center shadow-md px-2 py-2">
                <div className="flex gap-2">
                    <span className="text-xl"><MdUpdate /></span>
                    {formatDate({ date: task.updatedAt })}
                </div>


            </div>

            {(task.status !== 'new') &&
                <div className="flex flex-wrap shadow-md px-2 py-1">
                    <div className="flex gap-2 flex-wrap items-center">
                        Отчет:
                        <button className="text-sm"
                            onClick={() => setIsEditReport(!isEditREport)}
                        >
                            {isEditREport
                                ? <span className="text-green-500/85  px-2 py-1 cursor-pointer  flex items-center  shadow-sm">
                                    <FaSave className="text-xl" />
                                </span>
                                : <span className="text-red-500/85  px-2 py-1 cursor-pointer flex items-center  shadow-sm">
                                    <FaEdit className="text-xl" />
                                </span>
                            }
                        </button>
                    </div>
                    {isEditREport &&
                        <textarea
                            className={`border px-2 py-1 min-h-fit w-full ${!report && 'border-red-500'}`}
                            onChange={(e) => setReport(e.target.value)}
                            spellCheck
                            value={report}
                            onBlur={onBlurReportHandler}
                        />}

                    <p className="px-2 py-2 word-break">{report}</p>
                </div>
            }

            <button className='flex gap-2 text-2xl cursor-pointer hover:text-red-500/85 self-end shadow-sm'
                onClick={() => {
                    setisVisibleComments(!isVisibleCommets)
                }
                }
            >
                <span className="text-sm text-red-500/85 font-bold">
                    {(task?.comments && task?.comments?.length > 0)
                        && task?.comments?.length}
                </span>
                <TiMessages />

            </button>

            <CommentList
                comments={task.comments}
                userId={userId}
                taskId={task.id}
                isVisibleCommets={isVisibleCommets}
            />

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
                        message="Хотите удалить заявку?"
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                    />
                </div>
            )}
        </div>
    )
}