import React from 'react';
import { AiFillHome } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { IoMdNotifications } from "react-icons/io";
const SideNav = () => {
    return (
        <>
            <div className='fixed shadow-lg bg-white p-5 md:flex justify-end w-[200px] h-screen  hidden  '>
                   <div>
                     <Link to='/home'
                     className='flex items-center gap-2 font-semibold text-2xl'
                     >
                        <AiFillHome size={30}/>
                        <h1>Home</h1>
                    </Link>
                    <Link to='/notification'
                    className='flex items-center gap-2 font-semibold text-2xl'
                    >
                        <IoMdNotifications size={30}/>
                        <h1>Notification</h1>
                    </Link>
                   </div>
            </div>
        </>
    );
};

export default SideNav;