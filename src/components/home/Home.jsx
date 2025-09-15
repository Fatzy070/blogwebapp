import React from 'react';
import CreatePost from '../post/CreatePost';
import Feed from './Feed';
const Home = () => {
    return (
        <div className='border md:w-[600px]'>
            <CreatePost />
            <Feed />
        </div>
    );
};

export default Home;