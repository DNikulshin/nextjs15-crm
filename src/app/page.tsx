'use client'

import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { useCreateNewTask, useTasks } from "../hooks/useTask";
import { useUserId } from "@/hooks/useUser";
import { IFormDataCreateTask } from "../types/types";
import { TaskItem } from "../components/Task";
import { SelectStatus } from "../components/SelectStatus";
import { logout } from "./login/actions";
import { FilterByDate } from "@/components/FilterByDate";



export default function Home() {
  const { data: userIdFromSession, isFetching: isFetchingUserId } = useUserId()
  const [visibleCreateForm, setVisibleCreateForm] = useState(false)
  const [formValue, setFormValue] = useState<IFormDataCreateTask>(
    { title: '', description: '' });

  const [status, setStatus] = useState('')
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSingleDate, setIsSingleDate] = useState(false);

  const { data, isFetching, error, isError } = useTasks({ status, endDate, startDate })

  const createTask = useCreateNewTask()

  const changeHandler: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const loginFormData = new FormData();
    if (!formValue.title || !formValue.description || !userIdFromSession) return;
    loginFormData.append('title', formValue.title.trim());
    loginFormData.append('description', formValue.description.trim())

    createTask.mutate({ ...formValue, userId: userIdFromSession }, {
      onSuccess: () => {
        setFormValue({ title: '', description: '', userId: userIdFromSession })
        setVisibleCreateForm(false)
      },
      onError: (error) => {
        console.log(error);

      }
    })
  };

  const taskCounts: Record<string, number> = data?.reduce((acc: Record<string, number>, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {}) || {};

  if (isFetchingUserId) {
    return <div className="h-screen flex justify-center items-center text-blue-500 font-bold text-center">
      <div className="loader"></div>
    </div>
  }

  if (isError) {
    return <div className="h-screen flex justify-center items-center text-red-500 font-bold text-center">{(error as Error).message}</div>
  }

  return (
    <div className="h-screen mx-auto">
      <header className="flex justify-between items-center p-3 shadow-sm shadow-amber-100 mb-3 flex-wrap gap-2">
        <div>UserId: {userIdFromSession}</div>
        <button onClick={() => setVisibleCreateForm(!visibleCreateForm)} className=" bg-green-600 px-3 py-1 rounded-md">Create task</button>
        <button
          className="bg-red-500 px-2 py-1 rounded-sm cursor-pointer"
          onClick={() => logout()}>
          Logout
        </button>
      </header>
      <main className="flex flex-col justify-center items-center mx-auto pb-3 container px-2">
        {visibleCreateForm && <form
          onSubmit={handleSubmit}
          className="w-full flex gap-3 flex-col mx-auto px-4 pt-8 pb-4 md:w-1/2 sticky bg-gray-900 z-5 top-0 mb-4 shadow-sm shadow-amber-100">
          <input
            type="text"
            placeholder="Enter title..."
            className="border px-2 py-1"
            name="title"
            onChange={changeHandler}
            value={formValue.title}
          />
          <textarea
            placeholder="Enter description..."
            className="border px-2 py-1 min-h-auto"
            name="description"
            onChange={changeHandler}
            value={formValue.description}
          />

          <button type="submit"
            disabled={createTask.isPending}
            className="flex bg-green-600 px-3 py-1 cursor-pointer disabled:bg-gray-400 self-end rounded-md">
            Create
          </button>
          <button
            className="text-white items-center flex justify-center absolute top-0 right-0 bg-red-500 px-2  disabled:bg-gray-400 cursor-pointer"
            onClick={() => setVisibleCreateForm(false)}
          >
            x
          </button>
        </form>
        }
        <div className="flex justify-center items-center flex-wrap shadow-sm shadow-amber-100 px-2 py-1 mb-3 gap-2 relative">
          {

            isFetching &&
            <div className="flex justify-center items-center text-blue-700 font-bold text-center  absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
              Update...
            </div>
          }
          <FilterByDate
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            isSingleDate={isSingleDate}
            setIsSingleDate={setIsSingleDate}
          />

          <SelectStatus
            setStatus={setStatus}
            status={status}
          />
        </div>


        {!data?.length && !isFetching ?
          <div className="flex justify-center items-center text-red-500 font-bold">No Tasks...</div>
          :
          <div className="flex flex-col border gap-3  bg-slate-800 w-full mx-2 relative z-10 shadow-sm shadow-amber-100">
            <div className="flex flex-wrap  justify-center items-center gap-3 px-2 py-1">
              {Object.entries(taskCounts || {}).map(([status, count]) => (
                <div key={status} className={status}>
                  <span className="font-bold">{status}</span>: {count}
                </div>
              ))}

              {data && data?.length > 0 && <strong
                className="flex gap-2 justify-center items-center py-1">
                Total count:
                <span className="text-green-600">
                  {data?.length}
                </span>
              </strong>
              }
            </div>

            {data?.map((task, idx) => (
              <TaskItem task={task} idx={idx} key={task.id} />
            ))}
          </div>
        }
        {isFetching &&
          <div className="absolute top-[50%] right-[50%] text-center text-blue-700 font-bold loader"
          >
          </div>
        }
      </main>
    </div>
  );
}
