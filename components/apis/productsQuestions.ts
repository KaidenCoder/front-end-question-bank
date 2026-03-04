export const fetchData = async (query: string) => {
    try {
        const response = await fetch(
            `https://dummyjson.com/products/search?q=${query}`
        );
        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error("error", error)
    }
}