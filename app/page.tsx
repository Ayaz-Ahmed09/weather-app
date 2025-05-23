"use client"

import { useState, useEffect } from "react"
import WeatherDisplay from "@/components/weather-display"
import ForecastList from "@/components/forecast-list"
import HourlyForecast from "@/components/hourly-forecast"
import SearchLocation from "@/components/search-location"
import LoadingState from "@/components/loading-state"
import { AlertTriangle, Info } from "lucide-react"
import styles from "./page.module.css"

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usingMockData, setUsingMockData] = useState(false)

  // Get user's location on initial load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude)
        },
        (err) => {
          console.log("Geolocation error:", err.message)
          setError("Unable to get your location. Showing weather for Gujrat.")
          // Default to Gujrat like in your original app
          fetchWeatherByCity("Gujrat")
        },
        { timeout: 10000 },
      )
    } else {
      setError("Geolocation is not supported by your browser. Showing weather for Gujrat.")
      // Default to Gujrat if geolocation is not supported
      fetchWeatherByCity("Gujrat")
    }
  }, [])

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true)
    setError(null)
    setUsingMockData(false)

    try {
      console.log(`Fetching weather for coordinates: ${lat}, ${lon}`)

      // Fetch current weather
      const weatherResponse = await fetch(`/api/weather?lat=${lat}&lon=${lon}`)

      if (!weatherResponse.ok) {
        const errorText = await weatherResponse.text()
        throw new Error(`Weather API returned ${weatherResponse.status}: ${errorText}`)
      }

      const weatherJson = await weatherResponse.json()

      // Check if using mock data
      if (weatherJson._isMockData) {
        setUsingMockData(true)
      }

      // Fetch forecast
      const forecastResponse = await fetch(`/api/forecast?lat=${lat}&lon=${lon}&days=3`)

      if (!forecastResponse.ok) {
        const errorText = await forecastResponse.text()
        throw new Error(`Forecast API returned ${forecastResponse.status}: ${errorText}`)
      }

      const forecastJson = await forecastResponse.json()

      // Check if using mock data for forecast
      if (forecastJson._isMockData && !weatherJson._isMockData) {
        setUsingMockData(true)
      }

      setWeatherData(weatherJson)
      setForecastData(forecastJson)
      setLocation(weatherJson.location?.name || "Current Location")
      setError(null)
    } catch (err) {
      console.error("Error in fetchWeatherByCoords:", err)
      setError(`Error fetching weather data: ${err.message}`)
      setWeatherData(null)
      setForecastData(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchWeatherByCity = async (city) => {
    setLoading(true)
    setError(null)
    setUsingMockData(false)

    try {
      console.log(`Fetching weather for city: ${city}`)

      // Fetch current weather
      const weatherResponse = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)

      if (!weatherResponse.ok) {
        const errorText = await weatherResponse.text()
        throw new Error(`Weather API returned ${weatherResponse.status}: ${errorText}`)
      }

      const weatherJson = await weatherResponse.json()

      // Check if using mock data
      if (weatherJson._isMockData) {
        setUsingMockData(true)
      }

      // Fetch forecast
      const forecastResponse = await fetch(`/api/forecast?city=${encodeURIComponent(city)}&days=3`)

      if (!forecastResponse.ok) {
        const errorText = await forecastResponse.text()
        throw new Error(`Forecast API returned ${forecastResponse.status}: ${errorText}`)
      }

      const forecastJson = await forecastResponse.json()

      // Check if using mock data for forecast
      if (forecastJson._isMockData && !weatherJson._isMockData) {
        setUsingMockData(true)
      }

      setWeatherData(weatherJson)
      setForecastData(forecastJson)
      setLocation(city)
      setError(null)
    } catch (err) {
      console.error("Error in fetchWeatherByCity:", err)
      setError(`Could not find weather data for ${city}: ${err.message}`)
      setWeatherData(null)
      setForecastData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      fetchWeatherByCity(searchTerm)
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.weatherApp}>
        <h1 className={styles.title}>Real-Time Weather App</h1>

        <SearchLocation onSearch={handleSearch} />

        {usingMockData && (
          <div className={styles.mockDataNotice}>
            <AlertTriangle size={18} />
            <div>
              <p>
                <strong>Demo Mode:</strong> Using simulated weather data from WeatherAPI format.
              </p>
              <p className={styles.apiKeyInfo}>
                To see real weather data, get a free API key from{" "}
                <a href="https://www.weatherapi.com/" target="_blank" rel="noopener noreferrer">
                  WeatherAPI.com
                </a>{" "}
                (free tier includes 1 million calls/month).
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className={styles.infoNotice}>
            <Info size={18} />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <LoadingState />
        ) : (
          <>
            {weatherData && (
              <>
                <WeatherDisplay weather={weatherData} location={location} />
                {forecastData && forecastData.forecast && (
                  <>
                    <HourlyForecast hourlyData={forecastData.forecast.forecastday[0]?.hour || []} />
                    <ForecastList dailyData={forecastData.forecast.forecastday || []} />
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </main>
  )
}
