export const dataTSelectStatus = [
    { value: 'All' },
    { value: 'new' },
    { value: 'inWork' },
    { value: 'waiting' },
    { value: 'cancelled' },
    { value: 'completed' },

]



export const SelectStatus = (
    { setStatus, status }:
        {
            setStatus: (value: string) => void,
            status: string
        }) => {
    return (
        <div className="flex px-2 py-2 justify-start items-center gap-2">
            <span>Filtered Status:</span>
            <select
                className={`flex self-start px-2 py-1 gap-2 items-center rounded-sm cursor-pointer text-center border outline-none bg-slate-400 ${status}`}
                onChange={(e) => setStatus(e.target.value)}
                value={status}
            >

                {dataTSelectStatus.map(item => {
                    if (item.value === 'All') {
                        return <option value='' className={item.value} key={item.value}>All</option>
                    }
                    return (
                        <option value={item.value} className={item.value} key={item.value}>{item.value}</option>
                    )
                }


                )}
            </select>
        </div>
    )
}