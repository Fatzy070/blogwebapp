import React from 'react';
import CreatePost from '../post/CreatePost';
import SearchUsers from '../../utils/SearchUsers';
import Feed from './Feed';
const Home = () => {
    return (
        <div className=' md:w-[600px]'>
            <div className=' md:hidden'>
                <SearchUsers />
            </div>
            <CreatePost />
            <Feed />
        </div>
    );
};

export default Home;