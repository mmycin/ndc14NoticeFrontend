import { useState, useEffect } from "preact/hooks";
import axios from "axios";
import "./app.css";

export function App() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const noticesPerPage = 5;

    useEffect(() => {
        axios
            .get("https://ndc14notice.onrender.com/notice")
            .then((response) => {
                setNotices(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching notices:", error);
                setLoading(false);
            });
    }, []);

    const createMarkup = (content) => ({
        __html: content.replace(
            /<a /g,
            '<a style="color: #3B82F6; text-decoration: underline;" '
        ),
    });

    const totalPages = Math.ceil(notices.length / noticesPerPage);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const startIndex = (currentPage - 1) * noticesPerPage;
    const currentNotices = notices.slice(startIndex, startIndex + noticesPerPage);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-6 font-sans">
            {/* Header */}
            <header className="w-full max-w-4xl py-8 mb-6 bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-lg shadow-md text-center animate-fade-in">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-400 tracking-tight">
                    NDC Group 14 Notice Board
                </h1>
                <p className="text-gray-400 mt-2 text-lg font-medium">
                    Stay informed with the latest updates
                </p>
            </header>

            {/* Main Content */}
            <main className="w-full max-w-4xl flex-grow space-y-6">
                {loading ? (
                    <p className="text-center text-gray-400 font-semibold text-xl animate-pulse">
                        Loading notices...
                    </p>
                ) : (
                    <ul>
                        {currentNotices.map((notice, index) => (
                            <li
                                key={index}
                                className="p-6 mb-3 bg-gray-800 shadow-lg rounded-lg border border-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-700 animate-slide-up"
                            >
                                <h2 className="text-2xl font-bold text-indigo-300 mb-2">
                                    {notice.title}
                                </h2>
                                <p className="text-gray-500 text-sm font-medium mb-4">
                                    {notice.date}
                                </p>
                                <div
                                    className="text-gray-200 leading-relaxed font-light"
                                    dangerouslySetInnerHTML={createMarkup(notice.content)}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </main>

            {/* Pagination Bar */}
            <div className="w-full max-w-4xl mt-8 flex justify-center items-center space-x-6 animate-fade-in">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`px-4 py-2 rounded text-sm text-gray-300 font-semibold transition transform hover:text-indigo-400 hover:scale-105 ${
                        currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="text-gray-300 text-lg font-bold">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`px-4 py-2 rounded text-sm text-gray-300 font-semibold transition transform hover:text-indigo-400 hover:scale-105 ${
                        currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            {/* Footer */}
            <footer className="w-full max-w-4xl mt-12 p-4 bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-lg shadow-md text-center">
                <p className="text-sm font-light">
                    © {new Date().getFullYear()} Created by Tahcin Ul Karim (Mycin) - 12514013
                </p>
                <p className="mt-1 text-gray-500 text-xs">
                    All rights reserved | Notre Dame College, Dhaka
                </p>
            </footer>
        </div>
    );
}
