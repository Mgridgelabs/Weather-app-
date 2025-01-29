import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar.jsx";
import WeatherCard from "./components/WeatherCard.jsx";

// Use the API key from the .env file
const API_KEY = import.meta.env.VITE_API_KEY;

const App = () => {
  const [cities, setCities] = useState(() => {
    const storedCities = localStorage.getItem("cities");
    return storedCities ? JSON.parse(storedCities) : ["New York", "London", "Tokyo"];
  });
  const [weatherData, setWeatherData] = useState({});
  const [selectedCity, setSelectedCity] = useState(""); 
  const [error, setError] = useState("");
  const [newCity, setNewCity] = useState(""); 
  const [searchedCities, setSearchedCities] = useState([]);

  useEffect(() => {
    localStorage.setItem("cities", JSON.stringify(cities));
  }, [cities]);

  useEffect(() => {
    cities.forEach((city) => {
      if (!weatherData[city]) {
        fetchWeather(city);
      }
    });
  }, [cities]);

  const fetchWeather = async (city) => {
    setError(""); 
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "City not found");
      }

      const data = await res.json();
      setWeatherData((prevData) => ({ ...prevData, [city]: data }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCityChange = (newCity) => {
    if (!cities.includes(newCity) && !searchedCities.includes(newCity)) {
      fetchWeather(newCity);
      setSearchedCities((prevCities) => [...prevCities, newCity]);
    }
  };

  const handleAddCity = () => {
    if (newCity && !cities.includes(newCity)) {
      setCities((prevCities) => [...prevCities, newCity]);
      setNewCity(""); 
    }
  };

  const handleRemoveCity = () => {
    if (selectedCity) {
      setCities((prevCities) => prevCities.filter((city) => city !== selectedCity));
      setWeatherData((prevData) => {
        const newWeatherData = { ...prevData };
        delete newWeatherData[selectedCity];
        return newWeatherData;
      });

      setSelectedCity("");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center text-white p-6 bg-cover bg-center"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1558486012-817176f84c6d?q=80&w=970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
      }}
    >
      <h1 className="text-5xl font-bold mb-8 drop-shadow-lg text-center">
        ☁️ Weather App ⛅
      </h1>

      {/* Search Bar Section */}
      <div className="w-full max-w-3xl p-6 rounded-2xl shadow-lg bg-gray-100 text-gray-900 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">🔍 Search Weather</h2>
        <SearchBar onSearch={handleCityChange} />
      </div>

      {/* Search Results Section */}
      <div className="w-full max-w-3xl p-6 rounded-2xl shadow-lg text-amber mt-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">🌎 Search Results</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {searchedCities.length === 0 && <p className="text-center text-gray-500">No search results yet</p>}
          {searchedCities.map((city, index) =>
            weatherData[city] ? <WeatherCard key={index} weather={weatherData[city]} /> : null
          )}
        </div>
      </div>

      {/* Manage Cities Section */}
      <div className="w-full max-w-3xl p-6 rounded-2xl shadow-lg bg-white text-gray-900 mt-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">🏙️ Manage Cities</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            className="p-3 w-full rounded-lg border text-black bg-gray-100"
            placeholder="Enter city"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg w-full md:w-auto transition duration-300"
            onClick={handleAddCity}
            disabled={!newCity || cities.includes(newCity)}
          >
            ➕ Add City
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <select
            className="p-3 w-full rounded-lg border text-black bg-gray-100"
            onChange={(e) => setSelectedCity(e.target.value)}
            value={selectedCity}
          >
            <option value="">Select city to remove</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
          <button
            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg w-full md:w-auto transition duration-300"
            onClick={handleRemoveCity}
            disabled={!selectedCity}
          >
            ❌ Remove City
          </button>
        </div>
      </div>

      {/* Saved Cities Section */}
      <div className="w-full max-w-3xl p-6 rounded-2xl shadow-lg text-amber mt-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">📍 Saved Cities</h2>
        {cities.length === 0 ? (
          <p className="text-center text-gray-500">No saved cities yet</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {cities.map((city, index) =>
              weatherData[city] ? (
                <WeatherCard key={index} weather={weatherData[city]} />
              ) : null
            )}
          </div>
        )}
      </div>

      {/* Error Handling */}
      {error && <p className="mt-6 text-red-500 font-semibold text-center">{error}</p>}
    </div>
  );
};

export default App;
