
export function remove$(arr: any) {
    const result = arr.map((item: { [x: string]: any; }) => {
        const newItem: any = {};

        for (const key in item) {
            let newKey = key.replace(/^\$/, '');
            let value = item[key];

            newItem[newKey] = value;
        }
        return newItem;
    });
    return result;
}
