import { format } from "date-fns-tz"


export const formatDateForInputDate = ({date}: {date: Date}) => {
    return format(date, 'yyyy-MM-dd')
}