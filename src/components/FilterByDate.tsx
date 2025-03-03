

export const FilterByDate = (
    {
        isFetching,
        isSingleDate,
        startDate,
        endDate,
        setIsSingleDate,
        setStartDate,
        setEndDate
    }: {
        isFetching: boolean,
        isSingleDate: boolean,
        startDate: string,
        endDate: string,
        setIsSingleDate: React.Dispatch<React.SetStateAction<boolean>>,
        setStartDate: React.Dispatch<React.SetStateAction<string>>,
        setEndDate: React.Dispatch<React.SetStateAction<string>>
    }
) => {

    if (isFetching) {
        return <div className="flex justify-center items-center text-blue-500 font-bold text-center">
            Update...
        </div>
    }

    return (
        <div className="flex gap-2 flex-wrap justify-center items-center">
            <label className="flex gap-1 px-2 py-1">
                <input
                    type="radio"
                    checked={isSingleDate}
                    onChange={() => {
                        setIsSingleDate(true)
                    }}
                />
                One date
            </label>
            <label className="flex gap-1  px-2 py-1">
                <input
                    type="radio"
                    checked={!isSingleDate}
                    onChange={() => setIsSingleDate(false)}
                />
                Date range
            </label>

            {isSingleDate ? (
                <div className="flex gap-3 bg-slate-400 items-start justify-start rounded-sm">
                    <input
                        className=" bg-slate-400 px-2 rounded-sm"
                        type="date"
                        onChange={e => {
                            setStartDate(e.target.value)
                            setEndDate(e.target.value)
                        }}
                        value={startDate}
                    />
                </div>
            ) : (
                <div className="flex gap-3 items-start justify-start rounded-sm">
                    <input
                        className=" bg-slate-400 px-2 rounded-sm"
                        type="date"
                        onChange={e => setStartDate(e.target.value)}
                        value={startDate}
                    />
                    <input
                        className=" bg-slate-400 px-2  rounded-sm"
                        type="date"
                        onChange={e => setEndDate(e.target.value)}
                        value={endDate}
                    />
                </div>
            )}
        </div>
    )
}