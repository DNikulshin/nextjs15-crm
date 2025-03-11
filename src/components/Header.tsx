import { FaUserAlt } from "react-icons/fa"

interface Props {
    userFromSessionEmail: string | undefined

    setVisibleCreateForm: (visibleCreateForm: boolean) => void
    visibleCreateForm: boolean
    isLogout: boolean
    logoutHandler: () => void
}

export const Header = ({
    isLogout,
    logoutHandler,
    setVisibleCreateForm,
    visibleCreateForm,
    userFromSessionEmail

}: Props) => {

    return (
        <header className="flex justify-between items-center p-3 shadow-sm shadow-amber-100 mb-3 flex-wrap gap-2 sticky top-0 z-30 bg-slate-800/90">
            <div className=" container mx-auto">
                <div className="flex gap-2  justify-center items-center w-full mb-2"><FaUserAlt /> {userFromSessionEmail}</div>
                <div className="flex justify-between gap-3 items-center w-full">
                    <button onClick={() => setVisibleCreateForm(!visibleCreateForm)} className=" bg-green-600 px-3 py-1 rounded-md  cursor-pointer">Создать задачу</button>
                    <button
                        className="bg-red-500 px-2 py-1 rounded-sm cursor-pointer disabled:bg-gray-400"
                        disabled={isLogout}
                        onClick={logoutHandler}>
                        Выйти
                    </button>
                </div>
            </div>
        </header>
    )
}