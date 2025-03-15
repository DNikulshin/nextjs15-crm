import { CountTasks } from "./CountTasks"
import { TaskItem } from "./Task"
import { ResponseDataTask } from "@/types/types"

interface Props {
  data: ResponseDataTask | undefined
  userFromSessionId: string | undefined
}

export const TaskList = ({ data, userFromSessionId }: Props) => {

  return (
    <div className="flex flex-col border gap-3  bg-slate-800 w-full mx-2 mb-3 relative z-10 shadow-sm shadow-amber-100">
      <CountTasks data={data || null} />

      {data?.tasks?.map((task, idx) => (
        <TaskItem task={task} idx={idx} key={task.id} userId={userFromSessionId ?? ''} />
      ))}
    </div>
  )
}