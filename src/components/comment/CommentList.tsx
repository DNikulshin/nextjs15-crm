import { IDataComment } from '@/types/types'
import { Comment } from './Comment'
import { useState } from 'react'
import { useCreateNewComment } from '@/hooks/useComment'
import { BsFillSendFill } from "react-icons/bs";
import { FaPen } from "react-icons/fa";
import { Loader } from '@/shared/ui/Loader';

interface Props {
    userId: string
    taskId: string
    comments?: IDataComment[] | undefined
    isVisibleCommets: boolean
}

export const CommentList = ({ comments, userId, taskId, isVisibleCommets }: Props) => {

    const [content, setContent] = useState('')
    const [send, setSend] = useState(false)

    const createComment = useCreateNewComment()

    const onBlurHandler = () => {

        if (content?.trim()) {
            createComment.mutate(
                {
                    content,
                    userId,
                    taskId,
                    updatedAt: new Date(new Date().toISOString())
                },
                {
                    onSuccess: () => {
                        setContent('')
                    }
                }
            );

        }
    }

    if (!isVisibleCommets) {
        return null
    }

    return (
        <div className="flex flex-col gap-2 border-t-1 pt-2">
            <div className="flex flex-col gap-3 w-full shadow-md px-2 py-2 pb-4">
                {!send && <textarea
                    className="border px-2 py-1 min-h-fit"
                    onChange={(e) => setContent(e.target.value)}
                    spellCheck
                    value={content}

                    onBlur={onBlurHandler}
                />}
                <button
                    onClick={() => setSend(!send)}

                    className="bg-green-500 self-end px-4 py-2 rounded-sm shadow-sm shadow-green-500/50"

                >
                    <span className='text-xl cursor-pointer'>
                        {!send ? <BsFillSendFill /> : <FaPen />}
                    </span>
                </button>
            </div>
            <div className='relative'>
                {createComment.isPending ?
                    <Loader />
                    :
                    comments && comments.map(comment =>
                        <Comment
                            comment={comment}
                            userId={userId}
                            taskId={taskId}
                            key={comment.id}
                        />
                    )
                }
            </div>
        </div>
    )
}