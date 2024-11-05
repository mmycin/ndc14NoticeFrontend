import { useState, useEffect } from "preact/hooks";
import axios from "axios";
import "./app.css";

export function App() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 flex flex-col items-center p-6">
            <header className="w-full max-w-4xl py-10 mb-8 bg-opacity-80 backdrop-blur-md rounded-lg shadow-lg text-center transition-transform transform hover:scale-105 duration-300">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-400 tracking-tight font-poppins">
                    NDC Group 14 Notice Board
                </h1>
                <p className="text-gray-400 mt-2 text-lg font-roboto">
                    Stay updated with the latest notices
                </p>
            </header>

            <main className="w-full max-w-4xl flex-grow">
                {loading ? (
                    <p className="text-center text-gray-400 font-semibold text-xl animate-pulse">
                        Loading notices...
                    </p>
                ) : (
                    <ul className="space-y-6">
                        {notices.map((notice, index) => (
                            <li
                                key={index}
                                className="p-6 bg-gray-800 shadow-md rounded-lg border border-gray-700 transition duration-300 hover:shadow-xl transform hover:scale-105"
                            >
                                <h2 className="text-2xl font-semibold text-blue-400 font-poppins mb-2">
                                    {notice.title}
                                </h2>
                                <p className="text-gray-500 text-sm font-roboto mb-4">
                                    {notice.date}
                                </p>
                                <div
                                    className="text-gray-300 leading-relaxed font-roboto"
                                    dangerouslySetInnerHTML={createMarkup(notice.content)}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </main>

            <footer className="w-full max-w-4xl mt-12 p-4 bg-gray-800 text-gray-400 text-center rounded-lg shadow-lg">
                <p className="text-sm font-poppins">
                    © {new Date().getFullYear()} Created by Tahcin Ul Karim (Mycin) - 12514013
                </p>
                <p className="mt-1 text-gray-500 text-xs">
                    All rights reserved | Notre Dame College, Dhaka
                </p>
            </footer>
        </div>
    );
}
