import React, {useEffect} from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navbar from '../components/common/Navbar';

const BaseLayout = () => {
  const buildTawkChatWidget = async()=>{
    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/686df6e300e160190f563035/1ivmooqnn';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
  }
  useEffect(()=>{
    buildTawkChatWidget()
  },[])
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