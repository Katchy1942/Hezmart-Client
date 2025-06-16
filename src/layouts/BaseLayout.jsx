import React, {useEffect} from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BaseLayout = () => {
  return (
    <div className='relative'>
        <Header />
       <div className='bg-[#f1f1f2]'>
        <Outlet />
       </div>
        <Footer />
    </div>
  )
}

export default BaseLayout