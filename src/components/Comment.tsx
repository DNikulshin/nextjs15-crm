import { useUpdateComment } from "@/hooks/useComment"
import { formatDate } from "@/shared/utils/formatDate"
import { IDataComment } from "@/types/types"
import { useState } from "react"
import { FaEdit, FaSave, FaUserAlt } from "react-icons/fa"
import { FaRegMessage } from "react-icons/fa6";

interface Props {
    userId: string
    comment: IDataComment
}

export const Comment = ({ userId, comment }: Props) => {
    const [content, setContent] = useState(comment.content)
    const [isEditComment, setIsEditComment] = useState(false)


    const updateComentById = useUpdateComment()

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

    return (
        <div key={comment.id} className="flex flex-col gap-2 shadow-sm">
            <div className="flex  items-center justify-baseline gap-4">
                {(comment.userId === userId) &&
                    <button className="text-sm"
                        onClick={() => setIsEditComment(!isEditComment)}
                    >
                        {isEditComment
                            ? <span className="text-green-500/85 py-1 cursor-pointer  flex items-center">
                                <FaSave className="text-xl" />
                            </span>
                            : <span className="text-red-500/85 py-1 cursor-pointer flex items-center">
                                <FaEdit className="text-xl" />
                            </span>
                        }
                    </button>}
                <span className="flex font-bold items-center gap-2"><FaUserAlt /> {comment?.user?.email}</span>
            </div>

            {isEditComment &&
                <textarea
                    className="border px-2 py-1  min-h-fit"
                    onChange={(e) => setContent(e.target.value)}
                    spellCheck
                    value={content}
                    onBlur={onBlurHandler}
                />}

            <div className="flex flex-col gap-2">
                <span className="text-xl self-start"><FaRegMessage /></span>
                <p className="word-break">{comment.content}</p>
            </div>
            <div className="shadow-md px-2 py-2"><span>Дата обновления:</span> {formatDate({ date: comment.updatedAt })}</div>
        </div>
    )

}