import { NextResponse } from "next/server"

// Realistic mock data for demonstration
const generateMockWeatherData = (cityName: string, lat?: number, lon?: number) => {
  const conditions = [
    { text: "Sunny", code: 1000, temp: 22 },
    { text: "Partly cloudy", code: 1003, temp: 18 },
    { text: "Light rain", code: 1183, temp: 15 },
    { text: "Snow", code: 1210, temp: 2 },
  ]

  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]

  return {
    location: {
      name: cityName,
      region: "",
      country: "GB",
      lat: lat || 51.5085,
      lon: lon || -0.1257,
      tz_id: "Europe/London",
      localtime_epoch: Math.floor(Date.now() / 1000),
      localtime: new Date().toISOString().slice(0, 16).replace("T", " "),
    },
    current: {
      last_updated_epoch: Math.floor(Date.now() / 1000),
      last_updated: new Date().toISOString().slice(0, 16).replace("T", " "),
      temp_c: randomCondition.temp + (Math.random() * 6 - 3),
      temp_f: ((randomCondition.temp + (Math.random() * 6 - 3)) * 9) / 5 + 32,
      is_day: new Date().getHours() > 6 && new Date().getHours() < 20 ? 1 : 0,
      condition: {
        text: randomCondition.text,
        icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
        code: randomCondition.code,
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
      feelslike_c: randomCondition.temp + (Math.random() * 4 - 2),
      feelslike_f: ((randomCondition.temp + (Math.random() * 4 - 2)) * 9) / 5 + 32,
      vis_km: 10 + Math.random() * 15,
      vis_miles: (10 + Math.random() * 15) * 0.621371,
      uv: Math.random() * 10,
      gust_mph: 8 + Math.random() * 20,
      gust_kph: (8 + Math.random() * 20) * 1.609,
    },
    _isMockData: true,
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

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
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${query}&aqi=yes`

  try {
    console.log(`Fetching weather data for: ${locationName}`)

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
      return NextResponse.json(
        generateMockWeatherData(
          locationName,
          lat ? Number.parseFloat(lat) : undefined,
          lon ? Number.parseFloat(lon) : undefined,
        ),
      )
    }

    // Parse the JSON response
    const data = await response.json()

    // Handle API errors
    if (data.error) {
      console.error("WeatherAPI error:", data.error)
      return NextResponse.json(
        generateMockWeatherData(
          locationName,
          lat ? Number.parseFloat(lat) : undefined,
          lon ? Number.parseFloat(lon) : undefined,
        ),
      )
    }

    console.log("Successfully fetched real weather data from WeatherAPI")
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return NextResponse.json(
      generateMockWeatherData(
        locationName,
        lat ? Number.parseFloat(lat) : undefined,
        lon ? Number.parseFloat(lon) : undefined,
      ),
    )
  }
}
