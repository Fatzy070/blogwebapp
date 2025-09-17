import React from 'react';
import { Outlet } from 'react-router-dom';
import SideNav from './SideNav';
const Layout = () => {
    return (
        <div className='flex'>
            <SideNav />
          <div className='flex-1 md:ml-[230px]'>
              <Outlet />  
          </div>
        </div>
    );
};
export default Layout;