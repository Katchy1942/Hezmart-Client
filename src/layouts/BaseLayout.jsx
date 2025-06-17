import React, {useEffect} from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navbar from '../components/common/Navbar';

const BaseLayout = () => {
  return (
    <div className='relative'>
      <Header />
       <div className='bg-[#f1f1f2] relative px-4 sm:px-6 lg:px-8 pb-8'>
        <Outlet />
       </div>
      <Footer />
    </div>
  )
}

export default BaseLayout