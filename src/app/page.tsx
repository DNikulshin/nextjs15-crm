'use client'

import { ChangeEventHandler, FormEventHandler, useEffect, useState } from "react";
import { useCreateNewTask, useTasks } from "../hooks/useTask";
import { useUser } from "@/hooks/useUser";
import { IFormDataCreateTask } from "../types/types";
import { TaskList } from "../components/task/TaskList";
import { SelectStatus } from "../components/task/SelectStatus";
import { logout } from "./login/actions";
import { FilterByDate } from "@/components/task/FilterByDate";
import { Header } from "@/components/Header";
import { CreateForm } from "@/components/task/CreateForm";
import { Modal } from "@/shared/ui/Modal";
import { Loader } from "@/shared/ui/Loader";
import { formatDateForInputDate } from "@/shared/utils/formatDateForInpytDate";



export default function Home() {
  const { data: userFromSession, isFetching: isFetchingUserId } = useUser()
  const [visibleCreateForm, setVisibleCreateForm] = useState(false)
  const [formValue, setFormValue] = useState<IFormDataCreateTask>(
    { title: '', description: '' });

  const [status, setStatus] = useState('')
  const [startDate, setStartDate] = useState(formatDateForInputDate({ date: new Date() }))
  const [endDate, setEndDate] = useState(formatDateForInputDate({ date: new Date() }));
  const [isSingleDate, setIsSingleDate] = useState(false);
  const [isLogout, setIsLogout] = useState(false)

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

  const logoutHandler = async () => {
    setIsLogout(true)
    await logout()
    setIsLogout(false)
  }

  useEffect(() => {

    if (typeof window !== 'undefined') {
      const storedStatus = localStorage.getItem('selectedStatus');
      if (storedStatus) {
        setStatus(storedStatus);
      }
    }
  }, []);


  if (isFetchingUserId) {
    return <div className="h-screen flex justify-center items-center text-blue-500 font-bold text-center">
      <div className="loader"></div>
    </div>
  }

  if (isError) {
    return <div className="h-screen flex justify-center items-center text-red-500 font-bold text-center">{(error as Error).message}</div>
  }

  if (isLogout) {
    return <div className="h-screen flex justify-center items-center text-blue-500 font-bold text-center">
      <div className="loader"></div>
    </div>
  }

  return (
    <div className="h-screen mx-auto">
      <Header
        isLogout={isLogout}
        logoutHandler={logoutHandler}
        userFromSessionEmail={userFromSession?.userEmail}
        visibleCreateForm={visibleCreateForm}
        setVisibleCreateForm={setVisibleCreateForm}
      />
      <main className="flex flex-col justify-center items-center mx-auto pb-3 container px-2">
        {visibleCreateForm &&
          <Modal isVisible={setVisibleCreateForm}>
            <CreateForm
              handleSubmit={handleSubmit}
              changeHandler={changeHandler}
              formValue={formValue}
              setVisibleCreateForm={setVisibleCreateForm}
              isPending={createTask.isPending}
            />
          </Modal>
        }
        <div className="flex justify-center items-center flex-wrap shadow-sm shadow-amber-100 px-2 py-1 mb-3 gap-2 relative">
          {

            isFetching &&
            <Loader />
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

        {!data?.tasks?.length && !isFetching ?
          <div className="flex justify-center items-center text-red-500/85 font-bold text-xl">Записей пока нет...</div>
          :
          <TaskList
            data={data}
            userFromSessionId={userFromSession?.userId}
          />
        }
      </main>
    </div>
  );
}
