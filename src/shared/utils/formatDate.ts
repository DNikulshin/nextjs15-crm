export const formatDate = ({ date }: { date: Date }): string => {
    return new Date(date).toLocaleString()
}