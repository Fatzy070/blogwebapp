import React from 'react';
import { AiFillHome } from "react-icons/ai";
import { Link } from 'react-router-dom';
const SideNav = () => {
    return (
        <>
            <div className='fixed shadow-lg bg-white p-5 md:flex justify-end w-[200px] h-screen  hidden  '>
                   <div>
                     <Link to='/home'
                     >
                        <AiFillHome size={30}/>
                    </Link>
                    <Link >

                    </Link>
                   </div>
            </div>
        </>
    );
};

export default SideNav;