'use client'

import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { useCreateNewTask, useTasks } from "../hooks/useTask";
import { useUser } from "@/hooks/useUser";
import { IFormDataCreateTask } from "../types/types";
import { TaskItem } from "../components/Task";
import { SelectStatus } from "../components/SelectStatus";
import { logout } from "./login/actions";
import { FilterByDate } from "@/components/FilterByDate";



export default function Home() {
  const { data: userFromSession, isFetching: isFetchingUserId } = useUser()
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
    if (!formValue.title || !formValue.description || !userFromSession?.userId) return;
    loginFormData.append('title', formValue.title.trim());
    loginFormData.append('description', formValue.description.trim())

    createTask.mutate({ ...formValue, userId: userFromSession?.userId }, {
      onSuccess: () => {
        setFormValue({ title: '', description: '', userId: userFromSession?.userId })
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


  console.log(data);

  return (
    <div className="h-screen mx-auto">
      <header className="flex justify-between items-center p-3 shadow-sm shadow-amber-100 mb-3 flex-wrap gap-2 sticky top-0 z-30 bg-slate-800/90">
        <div>User: {userFromSession?.userEmail}</div>
        <button onClick={() => setVisibleCreateForm(!visibleCreateForm)} className=" bg-green-600 px-3 py-1 rounded-md">Create task</button>
        <button
          className="bg-red-500 px-2 py-1 rounded-sm cursor-pointer"
          onClick={() => logout()}>
          Logout
        </button>
      </header>
      <main className="flex flex-col justify-center items-center mx-auto pb-3 container px-2">
        {visibleCreateForm &&
          <div className="fixed inset-0 bg-slate-800/90 bg-opacity-50 z-40 px-2 -mx-2" onClick={() => setVisibleCreateForm(false)}>
            <form
              onSubmit={handleSubmit}
              onClick={e => e.stopPropagation()}
              className="w-full flex gap-3 flex-col px-4 pt-8 pb-4 md:w-1/2 bg-gray-900 shadow-sm shadow-amber-100 fixed top-[30%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50">
              <span>Title:</span>
              <textarea
                placeholder="Enter title..."
                className="border px-2 py-1 min-h-auto"
                name="title"
                onChange={changeHandler}
                value={formValue.title}
              />
              <span>Description:</span>
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
                className="text-white items-center flex justify-center absolute top-2.5 right-2.5 bg-red-500 px-2  disabled:bg-gray-400 cursor-pointer"
                onClick={() => setVisibleCreateForm(false)}
              >
                x
              </button>
            </form>
          </div>
        }
        <div className="flex justify-center items-center flex-wrap shadow-sm shadow-amber-100 px-2 py-1 mb-3 gap-2 relative">
          {

            isFetching &&
            <div className="w-full flex justify-center items-center font-bold text-center  absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] loader">
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
              <TaskItem task={task} idx={idx} key={task.id} userId={userFromSession?.userId ?? ''} userEmail={userFromSession?.userEmail ?? ''} />
            ))}
          </div>
        }
        {isFetching &&
          <div className="absolute top-[50%] right-[50%] text-center font-bold loader"
          >
          </div>
        }
      </main>
    </div>
  );
}
