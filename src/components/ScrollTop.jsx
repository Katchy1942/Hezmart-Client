import React from 'react'
import {LuMenu} from 'react-icons/lu';
import { FaArrowUp } from 'react-icons/fa';




const ScrollTop = () => {
  const[scrollStyles, setScrollStyles] = React.useState({})

  const scrollToHome = (e)=>{
    e.preventDefault();
    document.querySelector('#Home').scrollIntoView({behavior:'smooth', block:'start'})
  };

  window.addEventListener('scroll', ()=>{
    const styles = window.pageYOffset > 300 ? {bottom:'2%',opacity:'1',transition:'all .5s ease'} :{bottom:'-30%',opacity:'0',transition:'all .5s ease'}
    setScrollStyles(styles)
  });

  return (
    <a href='#' className='cursor-pointer flex justify-center items-center h-10 w-10 bg-gold rounded-full text-center right-[5%]   fixed z-[999]' style={scrollStyles} onClick={(e)=>{scrollToHome(e)}}>
      <FaArrowUp />
    </a>
  )
}

export default ScrollTop