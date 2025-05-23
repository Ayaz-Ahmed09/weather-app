import { Cloud, CloudRain, CloudSnow, Sun, Wind, Eye, Droplets, Gauge, Navigation } from "lucide-react"
import styles from "./weather-display.module.css"

interface WeatherDisplayProps {
  weather: {
    location: {
      name: string
      region: string
      country: string
      localtime: string
    }
    current: {
      temp_c: number
      temp_f: number
      feelslike_c: number
      feelslike_f: number
      humidity: number
      pressure_mb: number
      wind_mph: number
      wind_kph: number
      wind_dir: string
      wind_degree: number
      vis_km: number
      vis_miles: number
      uv: number
      is_day: number
      condition: {
        text: string
        icon: string
        code: number
      }
    }
  }
  location: string
}

export default function WeatherDisplay({ weather, location }: WeatherDisplayProps) {
  if (!weather || !weather.current) {
    return (
      <div className={styles.weatherDisplay}>
        <p className={styles.errorMessage}>Weather data is incomplete or unavailable</p>
      </div>
    )
  }

  const { current, location: weatherLocation } = weather
  const weatherCondition = current.condition?.text || "Unknown"

  // Format temperature to whole number
  const temperature = Math.round(current.temp_c)
  const feelsLike = Math.round(current.feelslike_c)

  // Get date from location time
  const localTime = new Date(weatherLocation.localtime)
  const formattedDate = localTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const formattedTime = localTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  // Get weather icon based on condition
  const getWeatherIcon = () => {
    const condition = weatherCondition.toLowerCase()
    const isDay = current.is_day === 1

    if (condition.includes("sunny") || condition.includes("clear")) {
      return isDay ? <Sun className={styles.weatherIcon} size={64} /> : <Sun className={styles.weatherIcon} size={64} />
    } else if (condition.includes("cloud") || condition.includes("overcast")) {
      return <Cloud className={styles.weatherIcon} size={64} />
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
      return <CloudRain className={styles.weatherIcon} size={64} />
    } else if (condition.includes("snow") || condition.includes("blizzard")) {
      return <CloudSnow className={styles.weatherIcon} size={64} />
    } else {
      return <Wind className={styles.weatherIcon} size={64} />
    }
  }

  // Get UV Index level
  const getUVLevel = (uvi: number) => {
    if (uvi <= 2) return { level: "Low", color: "#4CAF50" }
    if (uvi <= 5) return { level: "Moderate", color: "#FF9800" }
    if (uvi <= 7) return { level: "High", color: "#FF5722" }
    if (uvi <= 10) return { level: "Very High", color: "#9C27B0" }
    return { level: "Extreme", color: "#E91E63" }
  }

  const uvInfo = getUVLevel(current.uv)

  return (
    <div className={styles.weatherDisplay}>
      <div className={styles.mainInfo}>
        <div className={styles.locationDate}>
          <h2 className={styles.location}>
            {weatherLocation.name}
            {weatherLocation.region && `, ${weatherLocation.region}`}
          </h2>
          <p className={styles.date}>{formattedDate}</p>
          <p className={styles.time}>{formattedTime}</p>
        </div>

        <div className={styles.temperature}>
          <span className={styles.tempValue}>{temperature}°C</span>
          <span className={styles.feelsLike}>Feels like: {feelsLike}°C</span>
        </div>

        <div className={styles.weatherInfo}>
          {getWeatherIcon()}
          <div className={styles.weatherDescription}>
            <h3>{weatherCondition}</h3>
            <p>{current.is_day ? "Day" : "Night"}</p>
          </div>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <Droplets size={20} className={styles.detailIcon} />
          <span className={styles.detailLabel}>Humidity</span>
          <span className={styles.detailValue}>{current.humidity}%</span>
        </div>
        <div className={styles.detailItem}>
          <Wind size={20} className={styles.detailIcon} />
          <span className={styles.detailLabel}>Wind</span>
          <span className={styles.detailValue}>
            {Math.round(current.wind_kph)} km/h {current.wind_dir}
          </span>
        </div>
        <div className={styles.detailItem}>
          <Gauge size={20} className={styles.detailIcon} />
          <span className={styles.detailLabel}>Pressure</span>
          <span className={styles.detailValue}>{current.pressure_mb} mb</span>
        </div>
        <div className={styles.detailItem}>
          <Eye size={20} className={styles.detailIcon} />
          <span className={styles.detailLabel}>Visibility</span>
          <span className={styles.detailValue}>{Math.round(current.vis_km)} km</span>
        </div>
        <div className={styles.detailItem}>
          <Sun size={20} className={styles.detailIcon} />
          <span className={styles.detailLabel}>UV Index</span>
          <span className={styles.detailValue} style={{ color: uvInfo.color }}>
            {Math.round(current.uv)} ({uvInfo.level})
          </span>
        </div>
        <div className={styles.detailItem}>
          <Navigation size={20} className={styles.detailIcon} />
          <span className={styles.detailLabel}>Wind Dir</span>
          <span className={styles.detailValue}>{current.wind_degree}°</span>
        </div>
      </div>
    </div>
  )
}
