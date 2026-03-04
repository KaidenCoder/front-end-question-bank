import { debounce } from "@/utils/debounce";
import { useCallback, useMemo } from "react";
import { fetchData } from "../apis/productsQuestions";

type SearchBarProps = {
    searchValue: string;
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchBar({searchValue, setSearchValue}: SearchBarProps) {
    const debounceChange = useMemo(()=> debounce((val) => {
        fetchData(val);
    }, 2000), [])

    const handleChange = useCallback((e: any) => {
        setSearchValue(e.target.value)
        debounceChange(e.target.value)
    }, [debounceChange])

    return (
        <div>
            <input value={searchValue} onChange={handleChange}/>
        </div>
    )
}