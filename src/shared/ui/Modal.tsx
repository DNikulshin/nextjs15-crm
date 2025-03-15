interface Props {
    children: React.ReactNode
    isVisible: (boolean: boolean) => void
}


export const Modal = ({ children, isVisible }: Props) => {

    return (
        <div className="fixed inset-0 bg-slate-800/90 bg-opacity-50 z-40 px-2 -mx-2" onClick={() => isVisible(false)}>
            {children}
        </div>
    )
}