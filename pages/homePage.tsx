import Navbar from "@/components/Navbar/MenuBar"
import { useState } from "react";

export default function HomePage(){
    const [searchValue, setSearchValue] = useState("");
    console.log("searchValue", searchValue)
    return (
        <div>
            <Navbar searchValue={searchValue} setSearchValue={setSearchValue}/>
            <h1>HomePage Okay</h1>
        </div>
    )
}