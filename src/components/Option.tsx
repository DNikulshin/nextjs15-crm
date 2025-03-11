export const Option = ({ item }: { item: { value: string, translate: string } }) => {

    return (
        <option value={item.value}
            className={item.value}

            key={item.value}
        >
            {item.translate}
        </option>
    )
}