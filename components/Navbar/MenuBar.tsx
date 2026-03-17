"use client";

import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./MenuBar.module.css";

type NavbarProps = {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
};

export default function Navbar({
  searchValue,
  setSearchValue,
}: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className={styles.navbar}>
        <button
          className={styles.menuButton}
          onClick={() => setOpen(true)}
        >
          ☰
        </button>

        <div className={styles.center}>
          <SearchBar
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>
      </nav>

      {open && (
        <div
          className={styles.overlay}
          onClick={() => setOpen(false)}
        >
          <div
            className={styles.sidebar}
            onClick={(e) => e.stopPropagation()}
          >
            <a href="/">Home</a>
            <a href="/">Quiz</a>
          </div>
        </div>
      )}
    </>
  );
}