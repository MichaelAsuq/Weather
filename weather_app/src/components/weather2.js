import React, { useState, useEffect } from "react";
import axios from 'axios';
import './weather.css';
import { motion } from 'framer-motion';

const Weather2 = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState('');
    const [error, setError] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [forecast, setForecast] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [showMessage, setShowMessage] = useState(true);



    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMessage(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);


    useEffect(() => {
        if (city) {
            fetchCurrentWeather(city);
        }
    }, [city]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setCity(value);

        if (debounceTimeout) clearTimeout(debounceTimeout);

        setDebounceTimeout(setTimeout(() => {
            fetchCurrentWeather(value);
        }, 500));
    };

    const getBackgroundColor = (temp) => {
        if (temp < 0) {
            return '#00BFFF';
        } else if (temp >= 0 && temp <= 15) {
            return '#B0C4DE';
        } else if (temp > 15 && temp <= 25) {
            return '#FAFAD2';
        } else {
            return '#FFDAB9';
        }
    };

    const fetchCurrentWeather = async (city) => {
        if (!city) return;

        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=06bc4d50b1614be2ecb7d0ff6c2d0baa&units=metric`);
            console.log(response);
            setWeatherData(response.data);
            const temp = Math.round(response.data.main.temp);
            setBackgroundColor(getBackgroundColor(temp));
            fetchForecast(city);
            setError('');
        } catch (err) {
            console.log(err);
            setError('City not found');
            setWeatherData(null);
        }
    };

    const fetchForecast = async (city) => {
        try {
            const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
                params: {
                    q: city,
                    appid: '06bc4d50b1614be2ecb7d0ff6c2d0baa',
                    units: 'metric'
                }
            });
            setForecast(response.data.list);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching forecast data:", error);
            setForecast([]);
        }
    };

    const getDayName = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString('en-US', { weekday: 'short' });
    };


    return (
        <div className="container-fluid">
            <div className="row justify-content-center h-100">
                <div className="col-12 col-md-12 col-lg-7 col-xl-7 align-items-center rounded-3 p-5" style={{
                    fontFamily: 'Rubik', fontSize: '18px', backgroundColor, transition: 'background-color 0.5s ease'
                }}>

                    {showMessage ? (
                        <motion.div className="text-center fs-4 mt-4"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.5, type: 'spring' }}
                        >
                            <h1>🌞 Welcome to Your Weather Hub! 🌧️</h1>
                            <p className="mt-3">Stay ahead of the weather with real-time updates!. Let’s find out what the skies have in store for you!</p>
                        </motion.div>

                    ) : (
                        <>

                            <div className="text-center">
                                <div className="text-center py-3" style={{ fontFamily: 'Rubik' }}>
                                    <h2>Weather Hub</h2>
                                </div>
                                <form>
                                    <input type="text" name="city" placeholder="Enter city" value={city} onChange={handleInputChange} />
                                </form>
                            </div>


                            {error && <p className='text-center fs-2 text-danger mt-3'>{error}</p>}

                            {weatherData && (

                                <div className="text-dark fw-normal mt-4 m-5">

                                    <div className="text-center fs-1 mb-3">
                                        <span className="temp">{Math.round(weatherData.main.temp)}&deg;</span>
                                        <span className="fs-2">{weatherData.name}</span>

                                    </div>
                                    <div className="d-flex justify-content-between mb-4">
                                        <span> Temp min</span>
                                        <span>{Math.round(weatherData.main.temp_min)}&deg; <i className="bi bi-thermometer-low text-danger" /></span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-4">
                                        <span> Temp max</span>
                                        <span>{Math.round(weatherData.main.temp_max)}&deg; <i className="bi bi-thermometer-high text-primary"></i></span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-4">
                                        <span> Humidity</span>
                                        <span>{weatherData.main.humidity}% <i className="bi bi-moisture" style={{ color: '#ADD8E6' }}></i></span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-4">
                                        <span> Cloudy</span>
                                        <span> {weatherData.clouds.all}% <i className="bi bi-cloud" style={{ color: '#D3D3D3' }}></i></span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-4">
                                        <span> Wind </span>
                                        <span> {weatherData.wind.speed}m/s  <i className="bi bi-wind" style={{ color: '#696969' }}></i> </span>
                                    </div>
                                </div>
                            )}

                            <hr />
                            {forecast.length > 0 && (
                                <div className="py-5">
                                    <h2 className="text-center mb-3">5-Day Forecast</h2>
                                    <div className="row justify-content-around">
                                        {forecast.filter((_, index) => index % 8 === 0).map((day) => (
                                            <div className="col-sm-1 col-md-2 col-lg-2 col-xl-2" key={day.dt}>
                                                <div className="text-center rounded py-2" style={{ height: '15rem' }}>
                                                    <p className="fs-3"> {getDayName(day.dt)}</p>
                                                    <p className="fs-2"> {Math.round(day.main.temp)}°C</p>
                                                    <p> {day.weather[0].description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Weather2;
