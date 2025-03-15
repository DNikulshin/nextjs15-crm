const statusTranslations: Record<string, string> = {
  new: 'Новая',
  inWork: 'В работе',
  waiting: 'В ожидании',
  cancelled: 'Отменено',
  completed: 'Выполнено',
  inArchive: 'В архиве',
};

interface Props {
  data: {
    tasks: {
      status: string;
    }[];
    totalCount: number;
  } | null;
}



export const CountTasks = ({ data }: Props) => {

  const taskCounts: Record<string, number> = data?.tasks?.reduce((acc: Record<string, number>, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <div className="flex flex-col  justify-center items-center">
      <div className="flex flex-wrap justify-center items-center gap-2 px-2 py-1">
        {Object.entries(taskCounts || {}).map(([status, count]) => (
          <div key={status} className={status}>
            <span className="font-bold">{statusTranslations[status] || status}</span>: {count}
          </div>
        ))}
      </div>

      {data && (data?.totalCount > 0) && <strong
        className="flex gap-2 justify-center items-center py-1">
        Общее количество:
        <span className="text-green-600">
          {data?.totalCount ?? ''}
        </span>
      </strong>
      }
    </div>
  )
}