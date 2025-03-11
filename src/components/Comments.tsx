import { IDataComment } from '@/types/types'
import { Comment } from './Comment'
import { TiMessages } from "react-icons/ti";

interface Props {
    userId: string
    comments?: IDataComment[] | undefined
}

export const Comments = ({ comments, userId }: Props) => {

    if (!comments?.length) {
        return null
    }

    return (
        <div className="flex flex-col gap-2">
            <span className='flex text-xl cursor-pointer hover:text-red-500/85 self-end'><TiMessages /></span>
            {
                comments && comments.map(comment =>
                    <Comment
                        comment={comment}
                        userId={userId}
                        key={comment.id}
                    />
                )
            }
        </div>
    )
}