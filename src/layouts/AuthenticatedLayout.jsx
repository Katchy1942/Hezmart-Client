import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import ScrollToTop from './../components/ScrollToTop'

export default function AuthenticatedLayout() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [toggle, setToggle] = useState(false);

    return (
        <div className="min-h-screen bg-slate-100 relative">
            <ScrollToTop />
            {toggle && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-[15] md:hidden"
                    onClick={() => setToggle(false)}
                />
            )}

            {/* Sidebar */}
            <Sidebar user={user} isToggle={toggle} setToggle={setToggle}/>

            {/* Main Content */}
            <div className="md:ml-56 min-h-full relative">
                <Header setToggle={setToggle} toggle={toggle} user={user} />
               
                {/* Main Content Area */}
                <main className="py-6 md:py-4 px-4 relative z-0 pb-20 md:pb-10 overflow-x-auto mt-[64px]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}