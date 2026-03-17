"use client";

import { debounce } from "@/utils/debounce";
import { useCallback, useMemo, useEffect } from "react";
import { fetchData } from "../apis/productsQuestions";
import styles from "./SearchBar.module.css";

type SearchBarProps = {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
};

export default function SearchBar({
  searchValue,
  setSearchValue,
}: SearchBarProps) {

  const debounceChange = useMemo(() => {
    return debounce((val: string) => {
      fetchData(val);
    }, 2000);
  }, []);

  useEffect(() => {
    return () => {
      debounceChange.cancel();
    };
  }, [debounceChange]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setSearchValue(value);
      debounceChange(value);
    },
    [debounceChange, setSearchValue]
  );

  return (
    <div className={styles.searchContainer}>
        <input
        className={styles.input}
        value={searchValue}
        onChange={handleChange}
        placeholder="Search..."
        />
    </div>
  );
}