interface Props {
    isPending: boolean
    isPendingText: string
    text: string
}

export const SubmitButton = ({ isPending, isPendingText, text }: Props) => {

    return (
        <button className="bg-green-500 px-4 py-2 font-medium text-lg rounded-sm shadow-sm shadow-green-500/90 cursor-pointer disabled:bg-gray-400 self-end"
            disabled={isPending} type="submit">
            {isPending ? <span>{isPendingText}</span> : <span>{text}</span>}
        </button>
    );
}
