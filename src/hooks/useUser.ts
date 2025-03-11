import { useQuery } from '@tanstack/react-query'
import { getUser } from '@/app/login/actions'

const useUser = () => {

    return useQuery({
        queryKey: ['user'],
        queryFn: () => getUser()
    })
}

export { useUser }
