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

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
            <div className="w-full max-w-4xl bg-white bg-opacity-80 backdrop-blur-lg rounded-lg shadow-xl p-6 md:p-8 flex-grow">
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 text-center mb-6 md:mb-8 font-poppins">
                    Notice for Group - 14 of NDC
                </h1>
                {loading ? (
                    <p className="text-lg md:text-xl font-semibold text-gray-700 font-roboto text-center">
                        Loading notices...
                    </p>
                ) : (
                    <ul className="space-y-4 md:space-y-6">
                        {notices.map((notice, index) => (
                            <li
                                key={index}
                                className="bg-white bg-opacity-90 border border-gray-300 p-4 md:p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                            >
                                <h2 className="text-xl md:text-2xl font-semibold text-indigo-800 mb-2 font-poppins">
                                    {notice.title}
                                </h2>
                                <p className="text-sm md:text-base text-gray-500 mb-4 font-roboto">
                                    {new Date(notice.date).toLocaleDateString()}
                                </p>
                                <p className="text-sm md:text-base text-gray-700 leading-relaxed font-roboto">
                                    {notice.content}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <footer className="w-full max-w-4xl mt-8 bg-gray-800 text-white text-center p-4 rounded-lg shadow-xl">
                <p className="text-sm md:text-base font-poppins">
                    © {new Date().getFullYear()} Created by Tahcin Ul Karim (Mycin)
                </p>
            </footer>
        </div>
    );
}
