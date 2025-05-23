import { Cloud, CloudRain, CloudSnow, Sun, Wind } from "lucide-react"
import styles from "./forecast-list.module.css"

interface DailyData {
  date: string
  date_epoch: number
  day: {
    maxtemp_c: number
    maxtemp_f: number
    mintemp_c: number
    mintemp_f: number
    avgtemp_c: number
    avgtemp_f: number
    maxwind_kph: number
    totalprecip_mm: number
    avgvis_km: number
    avghumidity: number
    daily_chance_of_rain: number
    daily_chance_of_snow: number
    condition: {
      text: string
      icon: string
      code: number
    }
    uv: number
  }
  astro: {
    sunrise: string
    sunset: string
    moonrise: string
    moonset: string
    moon_phase: string
    moon_illumination: number
  }
}

interface ForecastListProps {
  dailyData: DailyData[]
}

export default function ForecastList({ dailyData }: ForecastListProps) {
  if (!dailyData || dailyData.length === 0) {
    return (
      <div className={styles.forecastContainer}>
        <h2 className={styles.forecastTitle}>3-Day Forecast</h2>
        <p className={styles.errorMessage}>Daily forecast data is unavailable</p>
      </div>
    )
  }

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase()

    if (conditionLower.includes("sunny") || conditionLower.includes("clear")) {
      return <Sun className={styles.forecastIcon} size={28} />
    } else if (conditionLower.includes("cloud") || conditionLower.includes("overcast")) {
      return <Cloud className={styles.forecastIcon} size={28} />
    } else if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
      return <CloudRain className={styles.forecastIcon} size={28} />
    } else if (conditionLower.includes("snow") || conditionLower.includes("blizzard")) {
      return <CloudSnow className={styles.forecastIcon} size={28} />
    } else {
      return <Wind className={styles.forecastIcon} size={28} />
    }
  }

  // Format day name
  const formatDay = (dateString: string, index: number) => {
    if (index === 0) return "Today"
    if (index === 1) return "Tomorrow"

    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "short" })
  }

  return (
    <div className={styles.forecastContainer}>
      <h2 className={styles.forecastTitle}>3-Day Forecast</h2>
      <div className={styles.forecastList}>
        {dailyData.map((day, index) => (
          <div key={index} className={styles.forecastDay}>
            <div className={styles.forecastDate}>{formatDay(day.date, index)}</div>
            <div className={styles.forecastIconContainer}>{getWeatherIcon(day.day.condition.text)}</div>
            <div className={styles.forecastTemp}>
              <span className={styles.maxTemp}>{Math.round(day.day.maxtemp_c)}°</span>
              <span className={styles.minTemp}>{Math.round(day.day.mintemp_c)}°</span>
            </div>
            <div className={styles.forecastDetails}>
              <div className={styles.forecastPop}>
                {Math.max(day.day.daily_chance_of_rain, day.day.daily_chance_of_snow)}%
              </div>
              <div className={styles.forecastHumidity}>{day.day.avghumidity}%</div>
              <div className={styles.forecastWind}>{Math.round(day.day.maxwind_kph)} km/h</div>
            </div>
            <div className={styles.forecastDescription}>{day.day.condition.text}</div>
            <div className={styles.forecastAstro}>
              <div className={styles.astroItem}>
                <span>🌅 {day.astro.sunrise}</span>
              </div>
              <div className={styles.astroItem}>
                <span>🌇 {day.astro.sunset}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
