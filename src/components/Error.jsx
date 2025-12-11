import React from "react";
import { useRouteError, Link } from "react-router-dom";

export default function Error() {
    const error = useRouteError();

    const errorMessage = error?.message || "Unknown error occurred";
    const errorStatus = error?.status || "500";
    const errorStatusText = error?.statusText || "Server Error";

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 font-sans">
            <div className="max-w-lg w-full text-center">

                {/* The Technical Bit (Modernized) */}
                <div className="bg-red-50/80 border border-red-100 rounded-2xl p-6 text-left shadow-sm mb-8 backdrop-blur-sm mx-auto">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-1 h-12 bg-red-400 rounded-full"></div>
                        <div className="overflow-hidden">
                            <p className="text-red-900 font-mono text-sm uppercase tracking-wide font-bold mb-1">
                                Something went wrong!
                            </p>
                            <p className="text-gray-700 text-[14px] font-medium break-words">
                                "{errorMessage}"
                            </p>
                            <p className="text-gray-500 text-sm mt-1 font-mono">
                                Code: <span className="bg-red-100 px-2 py-0.5 rounded text-red-700">{errorStatus}</span> — {errorStatusText}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        to="/"
                        className="w-full sm:w-auto px-8 py-3.5 bg-black text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
                    >
                        Take Me Home
                    </Link>
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-900 border border-gray-200 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-200"
                    >
                        Try Again
                    </button>
                </div>

            </div>
        </div>
    );
}