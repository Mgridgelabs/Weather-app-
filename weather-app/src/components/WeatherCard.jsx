const WeatherCard = ({ weather }) => {
    console.log("Weather Card Props:", weather); // Debugging

    if (!weather || !weather.main || !weather.weather) return null;

    const { main, weather: weatherDetails, name } = weather;
    const { temp, humidity } = main;
    const { description, icon } = weatherDetails[0];

    return (
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{name}</h2>
            <p className="text-xl">{description}</p>
            <div className="flex justify-between mt-4">
                <div>
                    <h3 className="text-lg">Temperature: {temp}°C</h3>
                    <h3 className="text-lg">Humidity: {humidity}%</h3>
                </div>
                <img
                    src={`http://openweathermap.org/img/wn/${icon}.png`}
                    alt="Weather icon"
                    className="w-16 h-16"
                />
            </div>
        </div>
    );
};

export default WeatherCard;
