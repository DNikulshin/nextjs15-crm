import { IFormDataCreateTask } from "@/types/types"
import { ChangeEventHandler, FormEventHandler } from "react"

interface Props {
    handleSubmit: FormEventHandler<HTMLFormElement>
    changeHandler: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    formValue: IFormDataCreateTask
    setVisibleCreateForm: (visibleCreateForm: boolean) => void
    isPending: boolean
}


export const CreateForm = ({
changeHandler,
formValue,
handleSubmit,
setVisibleCreateForm,
isPending

}: Props) => {

    return (

        <form
        onSubmit={handleSubmit}
        onClick={e => e.stopPropagation()}
        className="w-full flex gap-3 flex-col px-4 pt-8 pb-4 md:w-1/2 bg-gray-900 shadow-sm shadow-amber-100 fixed top-[30%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50">
        <span>Заголовок:</span>
        <textarea
          placeholder="Введите текст заголовка..."
          className="border px-2 py-1 min-h-auto"
          name="title"
          onChange={changeHandler}
          value={formValue.title}
        />
        <span>Описание:</span>
        <textarea
          placeholder="Введите текст описания..."
          className="border px-2 py-1 min-h-auto"
          name="description"
          onChange={changeHandler}
          value={formValue.description}
        />

        <button type="submit"
          disabled={isPending}
          className="flex bg-green-600 px-3 py-1 cursor-pointer disabled:bg-gray-400 self-end rounded-md">
          Создать
        </button>
        <button
          className="text-white items-center flex justify-center absolute top-2.5 right-2.5 bg-red-500 px-2  disabled:bg-gray-400 cursor-pointer"
          onClick={() => setVisibleCreateForm(false)}
        >
          x
        </button>
      </form>
    )
}