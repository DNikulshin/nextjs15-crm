import { useFormStatus } from "react-dom"

interface Props {
    isPendingText: string
    text: string
}

export const SubmitButton = ({ isPendingText, text }: Props) => {
    const { pending } = useFormStatus()

    return (
        <button className="bg-green-500 px-4 py-2 font-medium text-lg rounded-sm shadow-sm shadow-green-500/90 cursor-pointer disabled:bg-gray-400 self-end"
            disabled={pending} type="submit">
            {pending ? <span>{isPendingText}</span> : <span>{text}</span>}
        </button>
    );
}
