import React from 'react';
import { BrowserRouter ,  Route, Routes, Navigate } from 'react-router-dom';
import Profile from './components/home/Profile';
import Login from './components/Log/Login';
import Signup from './components/Log/Signup';
import ForgotPassword from './components/Log/ForgotPassword';
import Feed from "./components/home/Feed";
import FollowersList from "./components/home/FollowersList";
import Home from './components/home/Home';
import Layout from './layout/Layout';
import NotificationsPage from './utils/NotificationPage';

const App = () => {
  return (
     
    <BrowserRouter>
      <Routes>
        {/* Redirect root to signup */}
        <Route index element={<Signup /> } /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />


        <Route path='/' element={<Layout />} >

         <Route path="feed" element={<Feed />} />
         <Route path="profile" element={<Profile />} />
         <Route path='home' element={<Home />} />
         <Route path="profile/:uid" element={<Profile />} />
        <Route path=":uid/:type" element={<FollowersList />} />
        <Route path='notification' element={<NotificationsPage />} />
        </Route>
       
      </Routes>
    </BrowserRouter>

  )
};

export default App;
