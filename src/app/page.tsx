'use client'

import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { useCreateNewTask, useTasks } from "../hooks/useTasks";
import { IFormDataCreateTask } from "../types/types";
import { TaskItem } from "../components/Task";
import { SelectStatus } from "../components/SelectStatus";

export default function Home() {

  const [formValue, setFormValue] = useState<IFormDataCreateTask>(
    { title: '', description: '', userId: '831d0a73-b095-479a-b057-8b0c537b5925' });

  const [status, setStatus] = useState('')


  const { data, isFetching, error, isError } = useTasks(status)
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
    if (!formValue.title || !formValue.description || !formValue.userId) return;
    loginFormData.append('title', formValue.title.trim());
    loginFormData.append('description', formValue.description.trim())
    loginFormData.append('userId', formValue.userId.trim())
    console.log(formValue);

    createTask.mutate(formValue, {
      onSuccess: () => {
        setFormValue({ title: '', description: '', userId: '831d0a73-b095-479a-b057-8b0c537b5925' })
      },
      onError: (error) => {
        console.log(error);

      }
    })

  };


  if (isError) {
    return <div className="h-screen flex justify-center items-center text-red-500 font-bold text-center">{(error as Error).message}</div>
  }

  return (
    <div className="h-screen pt-4 container mx-auto">
      <main className="flex flex-col justify-center items-center mx-2 pb-3">
        <form
          onSubmit={handleSubmit}
          className="w-full flex gap-3 flex-col mx-auto p-4 sm:w-1/2 sticky bg-gray-900 z-5 top-0 mb-4 shadow-sm shadow-amber-100">
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
        </form>

        <SelectStatus setStatus={setStatus} status={status} />

        {!data?.length && !isFetching ?
          <div className="flex justify-center items-center text-red-500 font-bold">No Tasks...</div>
          :
          <div className="flex flex-col border gap-3  bg-slate-800 w-full mx-2 relative z-10 shadow-sm shadow-amber-100">

            {data?.length && <strong
              className="flex gap-2 justify-center items-center py-1">
              Count:
              <span className="text-green-600">
                {data?.length}
              </span>
            </strong>
            }

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
