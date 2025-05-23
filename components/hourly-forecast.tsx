import { Cloud, CloudRain, CloudSnow, Sun, Wind } from "lucide-react"
import styles from "./hourly-forecast.module.css"

interface HourlyData {
  time: string
  time_epoch: number
  temp_c: number
  temp_f: number
  is_day: number
  condition: {
    text: string
    icon: string
    code: number
  }
  chance_of_rain: number
  chance_of_snow: number
}

interface HourlyForecastProps {
  hourlyData: HourlyData[]
}

export default function HourlyForecast({ hourlyData }: HourlyForecastProps) {
  if (!hourlyData || hourlyData.length === 0) {
    return (
      <div className={styles.hourlyContainer}>
        <h2 className={styles.hourlyTitle}>24-Hour Forecast</h2>
        <p className={styles.errorMessage}>Hourly forecast data is unavailable</p>
      </div>
    )
  }

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string, isDay: number) => {
    const conditionLower = condition.toLowerCase()
    const iconSize = 20

    if (conditionLower.includes("sunny") || conditionLower.includes("clear")) {
      return <Sun className={styles.hourlyIcon} size={iconSize} />
    } else if (conditionLower.includes("cloud") || conditionLower.includes("overcast")) {
      return <Cloud className={styles.hourlyIcon} size={iconSize} />
    } else if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
      return <CloudRain className={styles.hourlyIcon} size={iconSize} />
    } else if (conditionLower.includes("snow") || conditionLower.includes("blizzard")) {
      return <CloudSnow className={styles.hourlyIcon} size={iconSize} />
    } else {
      return <Wind className={styles.hourlyIcon} size={iconSize} />
    }
  }

  // Format time
  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    })
  }

  // Get current hour to highlight "now"
  const currentHour = new Date().getHours()

  return (
    <div className={styles.hourlyContainer}>
      <h2 className={styles.hourlyTitle}>24-Hour Forecast</h2>
      <div className={styles.hourlyScroll}>
        <div className={styles.hourlyList}>
          {hourlyData.map((hour, index) => {
            const hourTime = new Date(hour.time).getHours()
            const isCurrentHour = index === 0 || hourTime === currentHour

            return (
              <div key={index} className={`${styles.hourlyItem} ${isCurrentHour ? styles.currentHour : ""}`}>
                <div className={styles.hourlyTime}>{isCurrentHour && index === 0 ? "Now" : formatTime(hour.time)}</div>
                <div className={styles.hourlyIconContainer}>{getWeatherIcon(hour.condition.text, hour.is_day)}</div>
                <div className={styles.hourlyTemp}>{Math.round(hour.temp_c)}°</div>
                <div className={styles.hourlyPop}>{Math.max(hour.chance_of_rain, hour.chance_of_snow)}%</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
