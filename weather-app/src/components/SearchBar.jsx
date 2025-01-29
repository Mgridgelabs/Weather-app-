import { useState } from "react";

const SearchBar = ({ onSearch }) => {
    const [city, setCity] = useState("");

    const handleSearch = () => {
        if (city.trim() !== "") {
            onSearch(city);
            setCity(""); // Clear input after search
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <input
                type="text"
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleSearch} // Use handleSearch instead of calling onSearch directly
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition duration-300"
            >
                Search
            </button>
        </div>
    );
};

export default SearchBar;
