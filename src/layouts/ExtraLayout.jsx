import { logo } from '../assets/images';
import { Link } from 'react-router-dom';

export const ExtraLayout = ({ children } ) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
            <section className="w-full max-w-md sm:max-w-lg">
                
                <div className="flex justify-center mb-8">
                    <Link to="/">
                        <img
                            src={logo}
                            alt="Hezmart"
                            className="w-36 sm:w-44 object-contain"
                        />
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10 relative overflow-hidden">
                    {children}
                </div>

            </section>
        </div>
    );
}