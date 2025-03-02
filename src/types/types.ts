export interface IFormDataCreateTask {
    title: string,
    description: string,
    userId: string | null
}


export interface ISortedDateTasks {
    startDate?: string
    endDate?: string
}
