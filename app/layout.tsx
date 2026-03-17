"use client";

import { useState } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar/MenuBar";


export default function RootLayout({ children }: { children: React.ReactNode }) {
   const [searchValue, setSearchValue] = useState("");
  return (
    <html lang="en">
      <body>
        <Navbar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />  
        {children}
      </body>
    </html>
  );
}