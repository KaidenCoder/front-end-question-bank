import {useState} from 'react';
import SearchBar from '../SearchBar/SearchBar';
import './MenuBar.css'

type NavbarProps = {
    searchValue: string;
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function Navbar({searchValue, setSearchValue}: NavbarProps){
    const [open, setOpen] = useState(false);


    return (
        <nav className="navbar__body bg-black text-white p-4">
            <div>
            <div className="flex justify-between items-center">
                <button onClick={() => setOpen(!open)}>☰</button>
            </div>
            {open && (
                <div className="mt-4 flex flex-col gap-2">
                    <a href="/">Home</a>
                    <a href="/">Quiz</a>
                </div>
            )}
            </div>
            <div className='center'>
            <SearchBar searchValue={searchValue} setSearchValue={setSearchValue}/>
            </div>
        </nav>
    )
}