import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-10">
            <div className="bg-red-50/80 border border-red-100 rounded-2xl p-6 text-left 
            shadow-sm backdrop-blur-sm max-w-xl mx-auto">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-1 h-12 bg-red-400 rounded-full"></div>

                    <div className="overflow-hidden">
                        <p className="text-red-900 font-mono text-sm uppercase tracking-wide font-bold mb-1">
                            Page Not Found
                        </p>

                        <p className="text-gray-700 text-[14px] font-medium break-words">
                            The page you're trying to access doesn’t exist or may have been moved.
                        </p>

                        <p className="text-gray-500 text-sm mt-1 font-mono">
                            Code:{" "}
                            <span className="bg-red-100 px-2 py-0.5 rounded text-red-700">
                                404
                            </span>{" "}
                            — Not Found
                        </p>
                    </div>
                </div>
            </div>

            <Link
                to="/"
                className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full 
                font-medium hover:bg-blue-700 transition-colors duration-300"
            >
                Return to Home
            </Link>
        </div>
    );
};

export default NotFound;
