import { useState } from "react"
import { FaEdit, FaSave } from "react-icons/fa"

export const dataTSelectStatus = [
    { value: 'All', translate: 'Все' },
    { value: 'new', translate: 'Новая' },
    { value: 'inWork', translate: 'В работе' },
    { value: 'waiting', translate: 'В ожидании' },
    { value: 'cancelled', translate: 'Отменено' },
    { value: 'completed', translate: 'Выполнено' },
    { value: 'inArchive', translate: 'В архиве' },
]

export const SelectStatus = (
    { setStatus, status }:
        {
            setStatus: (value: string) => void,
            status: string
        }) => {

    const [isEditTitle, setIsEditTitle] = useState(false)

    return (
        <div className="flex px-2 py-2 justify-start items-center gap-2">
            <span>Фильтр по статусу:</span>
            <select
                className={`flex self-start px-4 py-2 gap-2 items-center rounded-sm cursor-pointer text-center border outline-none bg-slate-400 ${status}`}
                onChange={(e) => setStatus(e.target.value)}
                value={status}
            >

                {dataTSelectStatus.map(item => {
                    if (item.value === 'All') {

                        return <option value='' className="text-white" key={item.value}>{item.translate}</option>
                    }

                    return (
                        <option value={item.value} className={item.value} key={item.value}>{item.translate}</option>
                    )
                }

                )}
            </select>

            {isEditTitle ? <span className="text-green-500/85  px-2 py-1 cursor-pointer  flex items-center"
                onClick={() => {
                    setIsEditTitle(false)
                    localStorage.setItem('selectedStatus', status);
                }}>
                <FaSave className="text-2xl" />
            </span>
                : <span className="text-red-500/85  px-2 py-1 cursor-pointer flex items-center"
                    onClick={() => {
                        setIsEditTitle(true)
                        setStatus('')
                        localStorage.setItem('selectedStatus', '');
                    }}
                >
                    <FaEdit className="text-2xl" />
                </span>
            }
        </div>
    )
}