import { updateTask } from "../hooks/useTasks"

export const Option = ({ item }: { item: { value: string } }) => {


    return (
        <option value={item.value}
            className={item.value}

            key={item.value}
        >
            {item.value}
        </option>
    )
}