

interface CustomConfirmProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const CustomConfirm = ({ message, onConfirm, onCancel }: CustomConfirmProps) => {
    return (
        <div className="p-4 rounded-md shadow bg-black absolute top-[20%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-40 w-fit">
            <span>{message}</span>
            <div className=" flex justify-end mt-4 gap-3">
                <button onClick={onCancel} className="bg-green-500 mr-3 px-2  rounded-sm">Нет</button>
                <button onClick={onConfirm} className="bg-red-500 text-white px-2  rounded-sm">Да</button>
            </div>
        </div>

    )
}

