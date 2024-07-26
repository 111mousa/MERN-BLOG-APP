import { useState } from "react";
import HeaderLeft from "./HeaderLeft";
import Navbar from "./Navbar";
import HeaderRight from "./HeaderRight";

const Header = () => {
    const [toggle,setToggle] = useState(false);
    return ( 
        <header className="header">
            <HeaderLeft toggle={toggle} setToggle={setToggle}/>
            <Navbar toggle={toggle} setToggle={setToggle}/>
            <HeaderRight />
        </header>
    );
}

export default Header;