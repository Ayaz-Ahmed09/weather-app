import { NextResponse } from "next/server"

// Generate mock forecast data
const generateMockForecastData = (cityName: string) => {
  const conditions = [
    { text: "Sunny", code: 1000 },
    { text: "Partly cloudy", code: 1003 },
    { text: "Light rain", code: 1183 },
    { text: "Snow", code: 1210 },
  ]

  const forecastDays = []
  const baseTemp = 15 + Math.random() * 10

  // Generate 3 days of forecast
  for (let i = 0; i < 3; i++) {
    const condition = conditions[Math.floor(Math.random() * conditions.length)]
    const dayTemp = baseTemp + (Math.random() * 6 - 3)

    // Generate 24 hours for each day
    const hours = []
    for (let h = 0; h < 24; h++) {
      const hourCondition = conditions[Math.floor(Math.random() * conditions.length)]
      const tempVariation = Math.sin(h * 0.26) * 5 // Temperature variation throughout the day

      hours.push({
        time_epoch: Math.floor(Date.now() / 1000) + i * 86400 + h * 3600,
        time: new Date(Date.now() + i * 86400 * 1000 + h * 3600 * 1000).toISOString().slice(0, 16).replace("T", " "),
        temp_c: dayTemp + tempVariation,
        temp_f: ((dayTemp + tempVariation) * 9) / 5 + 32,
        is_day: h > 6 && h < 20 ? 1 : 0,
        condition: {
          text: hourCondition.text,
          icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
          code: hourCondition.code,
        },
        wind_mph: 5 + Math.random() * 15,
        wind_kph: (5 + Math.random() * 15) * 1.609,
        wind_degree: Math.floor(Math.random() * 360),
        wind_dir: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
        pressure_mb: 1013 + Math.floor(Math.random() * 20 - 10),
        pressure_in: (1013 + Math.floor(Math.random() * 20 - 10)) * 0.02953,
        precip_mm: Math.random() * 5,
        precip_in: Math.random() * 0.2,
        humidity: 45 + Math.floor(Math.random() * 30),
        cloud: Math.floor(Math.random() * 100),
        feelslike_c: dayTemp + tempVariation + (Math.random() * 2 - 1),
        feelslike_f: ((dayTemp + tempVariation + (Math.random() * 2 - 1)) * 9) / 5 + 32,
        windchill_c: dayTemp + tempVariation - 2,
        windchill_f: ((dayTemp + tempVariation - 2) * 9) / 5 + 32,
        heatindex_c: dayTemp + tempVariation + 1,
        heatindex_f: ((dayTemp + tempVariation + 1) * 9) / 5 + 32,
        dewpoint_c: dayTemp + tempVariation - 5,
        dewpoint_f: ((dayTemp + tempVariation - 5) * 9) / 5 + 32,
        will_it_rain: Math.random() > 0.7 ? 1 : 0,
        chance_of_rain: Math.floor(Math.random() * 100),
        will_it_snow: Math.random() > 0.9 ? 1 : 0,
        chance_of_snow: Math.floor(Math.random() * 20),
        vis_km: 10 + Math.random() * 15,
        vis_miles: (10 + Math.random() * 15) * 0.621371,
        gust_mph: 8 + Math.random() * 20,
        gust_kph: (8 + Math.random() * 20) * 1.609,
        uv: Math.random() * 10,
      })
    }

    forecastDays.push({
      date: new Date(Date.now() + i * 86400 * 1000).toISOString().slice(0, 10),
      date_epoch: Math.floor(Date.now() / 1000) + i * 86400,
      day: {
        maxtemp_c: dayTemp + 4,
        maxtemp_f: ((dayTemp + 4) * 9) / 5 + 32,
        mintemp_c: dayTemp - 3,
        mintemp_f: ((dayTemp - 3) * 9) / 5 + 32,
        avgtemp_c: dayTemp,
        avgtemp_f: (dayTemp * 9) / 5 + 32,
        maxwind_mph: 15 + Math.random() * 10,
        maxwind_kph: (15 + Math.random() * 10) * 1.609,
        totalprecip_mm: Math.random() * 10,
        totalprecip_in: Math.random() * 0.4,
        totalsnow_cm: Math.random() * 2,
        avgvis_km: 12 + Math.random() * 8,
        avgvis_miles: (12 + Math.random() * 8) * 0.621371,
        avghumidity: 50 + Math.floor(Math.random() * 30),
        daily_will_it_rain: Math.random() > 0.6 ? 1 : 0,
        daily_chance_of_rain: Math.floor(Math.random() * 100),
        daily_will_it_snow: Math.random() > 0.9 ? 1 : 0,
        daily_chance_of_snow: Math.floor(Math.random() * 20),
        condition: {
          text: condition.text,
          icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
          code: condition.code,
        },
        uv: Math.random() * 10,
      },
      astro: {
        sunrise: "06:30 AM",
        sunset: "07:45 PM",
        moonrise: "09:15 PM",
        moonset: "05:30 AM",
        moon_phase: [
          "New Moon",
          "Waxing Crescent",
          "First Quarter",
          "Waxing Gibbous",
          "Full Moon",
          "Waning Gibbous",
          "Last Quarter",
          "Waning Crescent",
        ][Math.floor(Math.random() * 8)],
        moon_illumination: Math.floor(Math.random() * 100),
        is_moon_up: Math.random() > 0.5 ? 1 : 0,
        is_sun_up: 1,
      },
      hour: hours,
    })
  }

  return {
    location: {
      name: cityName,
      region: "",
      country: "GB",
      lat: 51.5085,
      lon: -0.1257,
      tz_id: "Europe/London",
      localtime_epoch: Math.floor(Date.now() / 1000),
      localtime: new Date().toISOString().slice(0, 16).replace("T", " "),
    },
    forecast: {
      forecastday: forecastDays,
    },
    _isMockData: true,
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const days = searchParams.get("days") || "3"

  // WeatherAPI.com API key
  const apiKey = "2e14966bbdff41ce819133928241704"

  let query: string
  const locationName = city || "Current Location"

  // Build query based on parameters provided
  if (city) {
    query = encodeURIComponent(city)
  } else if (lat && lon) {
    query = `${lat},${lon}`
  } else {
    return NextResponse.json({ error: "City or coordinates are required" }, { status: 400 })
  }

  // Use HTTPS instead of HTTP
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=${days}&aqi=yes&alerts=no`

  try {
    console.log(`Fetching forecast data for: ${locationName}`)

    // Add error handling for the fetch request
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    })

    // Check if the response is JSON
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Non-JSON response received:", await response.text())
      console.warn("API returned non-JSON response - using mock data")
      return NextResponse.json(generateMockForecastData(locationName))
    }

    // Parse the JSON response
    const data = await response.json()

    // Handle API errors
    if (data.error) {
      console.error("WeatherAPI forecast error:", data.error)
      return NextResponse.json(generateMockForecastData(locationName))
    }

    console.log("Successfully fetched real forecast data from WeatherAPI")
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching forecast data:", error)
    return NextResponse.json(generateMockForecastData(locationName))
  }
}
