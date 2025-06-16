export class WeatherAgent {
  constructor() {
    this.name = 'Weather';
    this.apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  async execute(action, dependencies = {}) {
    switch (action) {
      case 'getWeatherData':
        return await this.getWeatherData(dependencies);
      case 'getForecast':
        return await this.getForecast(dependencies);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async getWeatherData(dependencies = {}) {
    try {
      let location = 'Cape Canaveral,FL,US'; // Default SpaceX location
      let coordinates = null;
      
      // If we have launch data, try to get weather for that location
      if (dependencies.launchData && dependencies.launchData.location) {
        const launchLocation = dependencies.launchData.location;
        if (launchLocation.includes('Cape Canaveral') || launchLocation.includes('Kennedy')) {
          location = 'Cape Canaveral,FL,US';
          coordinates = { lat: 28.5721, lon: -80.648 };
        } else if (launchLocation.includes('Vandenberg')) {
          location = 'Vandenberg,CA,US';
          coordinates = { lat: 34.7420, lon: -120.5724 };
        } else if (launchLocation.includes('Boca Chica') || launchLocation.includes('Starbase')) {
          location = 'Brownsville,TX,US';
          coordinates = { lat: 25.9975, lon: -97.1556 };
        }
      }

      // Use coordinates for more accurate weather data if available
      let weatherUrl;
      if (coordinates) {
        weatherUrl = `${this.baseUrl}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
      } else {
        weatherUrl = `${this.baseUrl}/weather?q=${location}&appid=${this.apiKey}&units=metric`;
      }

      const response = await fetch(weatherUrl);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid OpenWeatherMap API key - please check your API credentials');
        }
        throw new Error(`Weather API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      // Get additional forecast data for better analysis
      let forecastData = null;
      try {
        const forecastUrl = coordinates 
          ? `${this.baseUrl}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric&cnt=8`
          : `${this.baseUrl}/forecast?q=${location}&appid=${this.apiKey}&units=metric&cnt=8`;
        
        const forecastResponse = await fetch(forecastUrl);
        if (forecastResponse.ok) {
          forecastData = await forecastResponse.json();
        }
      } catch (e) {
        console.warn('Could not fetch forecast data:', e.message);
      }

      const weatherData = {
        location: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind?.speed || 0,
        windDirection: data.wind?.deg || 0,
        windGust: data.wind?.gust || null,
        description: data.weather[0].description,
        main: data.weather[0].main,
        visibility: data.visibility ? Math.round(data.visibility / 1000) : null, // Convert to km
        cloudiness: data.clouds.all,
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
        timestamp: new Date().toISOString(),
        coordinates: { lat: data.coord.lat, lon: data.coord.lon }
      };

      // Add forecast summary if available
      if (forecastData && forecastData.list) {
        weatherData.forecast = this.processForecast(forecastData.list);
      }

      // Add launch condition assessment
      weatherData.launchConditions = this.assessLaunchConditions(weatherData);

      return weatherData;
    } catch (error) {
      throw new Error(`Failed to get weather data: ${error.message}`);
    }
  }

  async getForecast(dependencies = {}) {
    try {
      let location = 'Cape Canaveral,FL,US';
      
      if (dependencies.launchData && dependencies.launchData.location) {
        const launchLocation = dependencies.launchData.location;
        if (launchLocation.includes('Vandenberg')) {
          location = 'Vandenberg,CA,US';
        } else if (launchLocation.includes('Boca Chica')) {
          location = 'Brownsville,TX,US';
        }
      }

      const response = await fetch(
        `${this.baseUrl}/forecast?q=${location}&appid=${this.apiKey}&units=metric&cnt=16`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      return this.processForecast(data.list);
    } catch (error) {
      throw new Error(`Failed to get forecast data: ${error.message}`);
    }
  }

  processForecast(forecastList) {
    return forecastList.slice(0, 8).map(item => ({
      time: new Date(item.dt * 1000).toLocaleString(),
      temperature: Math.round(item.main.temp),
      description: item.weather[0].description,
      windSpeed: item.wind?.speed || 0,
      precipitation: item.rain ? item.rain['3h'] || 0 : 0,
      cloudiness: item.clouds.all
    }));
  }

  assessLaunchConditions(weatherData) {
    const conditions = [];
    let riskLevel = 'LOW';
    let riskScore = 0;

    // Temperature check (extreme temperatures can affect equipment)
    if (weatherData.temperature < -5 || weatherData.temperature > 40) {
      conditions.push('Extreme temperature conditions');
      riskScore += 3;
    } else if (weatherData.temperature < 5 || weatherData.temperature > 35) {
      conditions.push('Suboptimal temperature conditions');
      riskScore += 1;
    }

    // Wind speed check (critical for launch operations)
    if (weatherData.windSpeed > 20) {
      conditions.push('Very high wind speeds');
      riskScore += 4;
    } else if (weatherData.windSpeed > 15) {
      conditions.push('High wind speeds');
      riskScore += 2;
    } else if (weatherData.windSpeed > 10) {
      conditions.push('Moderate wind speeds');
      riskScore += 1;
    }

    // Wind gusts (can be more dangerous than sustained winds)
    if (weatherData.windGust && weatherData.windGust > 25) {
      conditions.push('Dangerous wind gusts detected');
      riskScore += 3;
    }

    // Weather conditions (precipitation and storms are major concerns)
    const weatherMain = weatherData.main.toLowerCase();
    if (weatherMain.includes('thunderstorm')) {
      conditions.push('Thunderstorms present - high lightning risk');
      riskScore += 5;
    } else if (weatherMain.includes('rain')) {
      conditions.push('Precipitation present');
      riskScore += 2;
    } else if (weatherMain.includes('snow')) {
      conditions.push('Snow conditions');
      riskScore += 3;
    }

    // Cloudiness (affects visibility and can indicate weather instability)
    if (weatherData.cloudiness > 90) {
      conditions.push('Very heavy cloud cover');
      riskScore += 1;
    } else if (weatherData.cloudiness > 70) {
      conditions.push('Heavy cloud cover');
      riskScore += 0.5;
    }

    // Visibility
    if (weatherData.visibility && weatherData.visibility < 5) {
      conditions.push('Poor visibility conditions');
      riskScore += 2;
    }

    // Humidity (extreme humidity can affect equipment)
    if (weatherData.humidity > 95) {
      conditions.push('Extremely high humidity');
      riskScore += 1;
    }

    // Determine overall risk level
    if (riskScore >= 6) {
      riskLevel = 'HIGH';
    } else if (riskScore >= 3) {
      riskLevel = 'MEDIUM';
    }

    return {
      riskLevel,
      riskScore: Math.round(riskScore * 10) / 10,
      conditions: conditions.length > 0 ? conditions : ['Favorable conditions for launch operations'],
      recommendation: this.getLaunchRecommendation(riskLevel, riskScore),
      detailedAnalysis: this.getDetailedWeatherAnalysis(weatherData)
    };
  }

  getLaunchRecommendation(riskLevel, riskScore) {
    if (riskLevel === 'HIGH') {
      return 'High risk of weather-related delays or scrubs. Launch operations should be carefully evaluated.';
    } else if (riskLevel === 'MEDIUM') {
      return 'Moderate weather risk. Monitor conditions closely and have contingency plans ready.';
    } else {
      return 'Weather conditions are favorable for launch operations.';
    }
  }

  getDetailedWeatherAnalysis(weatherData) {
    const analysis = [];
    
    analysis.push(`Current conditions: ${weatherData.description} at ${weatherData.temperature}°C`);
    analysis.push(`Wind: ${weatherData.windSpeed} m/s from ${weatherData.windDirection}°`);
    
    if (weatherData.windGust) {
      analysis.push(`Wind gusts up to ${weatherData.windGust} m/s`);
    }
    
    analysis.push(`Humidity: ${weatherData.humidity}%, Pressure: ${weatherData.pressure} hPa`);
    analysis.push(`Cloud cover: ${weatherData.cloudiness}%`);
    
    if (weatherData.visibility) {
      analysis.push(`Visibility: ${weatherData.visibility} km`);
    }

    return analysis.join(' | ');
  }
}