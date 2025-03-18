

export const FilterByDate = (
    {
        isSingleDate,
        startDate,
        endDate,
        setIsSingleDate,
        setStartDate,
        setEndDate
    }: {
        isSingleDate: boolean,
        startDate: string,
        endDate: string,
        setIsSingleDate: React.Dispatch<React.SetStateAction<boolean>>,
        setStartDate: React.Dispatch<React.SetStateAction<string>>,
        setEndDate: React.Dispatch<React.SetStateAction<string>>
    }
) => {

    return (
        <div className="flex gap-2 flex-wrap justify-center items-center">
            <span className="text-white">Фильтр по дате:</span>
            <label className="flex gap-1 px-2 py-1">
                <input
                    type="radio"
                    checked={isSingleDate}
                    onChange={() => {
                        setIsSingleDate(true)
                    }}
                />
                День
            </label>
            <label className="flex gap-1  px-2 py-1">
                <input
                    className="text-white"
                    type="radio"
                    checked={!isSingleDate}
                    onChange={() => {
                        setIsSingleDate(false)
                    }}
                />
                Диапазон
            </label>

            {isSingleDate ? (
                <div className="flex gap-2 bg-slate-400 items-center justify-center rounded-sm text-center">
                    <input
                        className="bg-slate-400 rounded-sm text-white text-sm px-4 py-2  flex items-center justify-center"
                        type="date"

                        onChange={e => {
                            setStartDate(e.target.value)
                            setEndDate('')
                        }}
                        value={startDate}
                    />
                </div>
            ) : (
                <div className="flex gap-2 items-start justify-center rounded-sm flex-wrap">
                    <div>
                        <input
                            className="bg-slate-400 rounded-sm text-white text-sm px-4 py-2 flex items-center justify-center"
                            type="date"
                            onChange={e => setStartDate(e.target.value)}
                            value={startDate}
                        />
                    </div>
                    <div>
                        <input
                            className="bg-slate-400 rounded-sm  text-white text-sm px-4 py-2 flex items-center justify-center"
                            type="date"
                            onChange={e => setEndDate(e.target.value)}
                            value={endDate}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}