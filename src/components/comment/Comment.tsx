import { useRemoveComment, useUpdateComment } from "@/hooks/useComment"
import { formatDate } from "@/shared/utils/formatDate"
import { IDataComment } from "@/types/types"
import { useState } from "react"
import { FaEdit, FaSave, FaUserAlt } from "react-icons/fa"
import { FaRegMessage } from "react-icons/fa6";
import { CustomConfirm } from "../task/CustomConfirm"
import { MdUpdate } from "react-icons/md"
import { Loader } from "@/shared/ui/Loader"

interface Props {
    userId: string
    taskId: string
    comment: IDataComment

}

export const Comment = ({ userId, comment }: Props) => {
    const [content, setContent] = useState(comment.content)
    const [isEditComment, setIsEditComment] = useState(false)
    const [isConfirmVisible, setConfirmVisible] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState('');


    const updateComentById = useUpdateComment()
    const deleteComment = useRemoveComment()

    const onBlurHandler = () => {

        if (content?.trim() && content?.trim() !== comment.content?.trim()) {
            updateComentById.mutate(
                {
                    ...comment,
                    content,
                    updatedAt: new Date(new Date().toISOString()),
                }
            )
        }
    }

    const handleDeleteClick = (commentId: string) => {
        setCommentToDelete(commentId);
        setConfirmVisible(true);
    };

    const handleConfirm = () => {
        if (commentToDelete) {
            deleteComment.mutate(commentToDelete);
        }
        setConfirmVisible(false);
        setCommentToDelete('');
    };

    const handleCancel = () => {
        setConfirmVisible(false);
        setCommentToDelete('');
    };

    if (deleteComment.isPending) {
        return <Loader />
    }


    return (
        <div key={comment.id} className="flex flex-col gap-2 shadow-sm relative pt-8">
            <div className="flex  items-center justify-baseline gap-4">
                {(comment.userId === userId) &&
                    <button className="text-sm"
                        onClick={() => setIsEditComment(!isEditComment)}
                    >
                        {isEditComment
                            ? <span className="text-green-500/85 py-1 cursor-pointer  flex items-center">
                                <FaSave className="text-2xl" />
                            </span>
                            : <span className="text-red-500/85 py-1 cursor-pointer flex items-center">
                                <FaEdit className="text-2xl" />
                            </span>
                        }
                    </button>}
                <span className="flex font-bold items-center gap-2 text-ellipsis overflow-hidden">
                    <span className="text-md"><FaUserAlt /></span>
                    <span className="text-ellipsis overflow-hidden">
                        {comment?.user?.email}
                    </span>
                </span>
            </div>

            {isEditComment &&
                <textarea
                    className="border px-2 py-1  min-h-fit"
                    onChange={(e) => setContent(e.target.value)}
                    spellCheck
                    value={content}
                    onBlur={onBlurHandler}
                />}

            <div className="flex gap-2">
                <span className="text-2xl self-start"><FaRegMessage /></span>
                <p className="word-break">{comment.content}</p>
            </div>
            <div className="flex justify-between items-center shadow-md py-2">
                <div className="flex gap-2">
                    <span className="text-2xl"><MdUpdate /></span>
                    {formatDate({ date: comment.updatedAt })}
                </div>


            </div>

            {(comment.userId === userId) && <button
                className="text-white items-center flex justify-center absolute right-1 top-1 bg-red-500 px-3 py-1 text-xl  disabled:bg-gray-400 cursor-pointer"
                onClick={() => handleDeleteClick(comment.id)}
                disabled={deleteComment.isPending && updateComentById.isPending}
            >
                x
            </button>}

            {isConfirmVisible && (
                <div className={"retative inset-0 bg-black bg-opacity-50 z-10"}

                    onClick={handleCancel}>
                    <CustomConfirm
                        message="Хотите удалить комментарий?"
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                    />
                </div>
            )}
        </div>
    )

}