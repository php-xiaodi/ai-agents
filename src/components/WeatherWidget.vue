<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

const weatherData = ref<WeatherData | null>(null);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const defaultCity = 'Shanghai';

// OpenWeatherMap API key - 在实际应用中应该放在环境变量中
const API_KEY = '4a8e9c0fbf8f9f7a0f8e9c0fbf8f9f7a'; // 这是一个示例key，需要替换为真实的API key

const getWeatherByCoords = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error('无法获取天气数据');
    }
    
    const data = await response.json();
    processWeatherData(data);
  } catch (err) {
    console.error('获取天气数据失败:', err);
    error.value = '获取天气数据失败，请稍后再试';
    loading.value = false;
    // 失败时尝试获取默认城市的天气
    getWeatherByCity(defaultCity);
  }
};

const getWeatherByCity = async (city: string) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`无法获取${city}的天气数据`);
    }
    
    const data = await response.json();
    processWeatherData(data);
  } catch (err) {
    console.error('获取天气数据失败:', err);
    error.value = `获取${city}的天气数据失败，请稍后再试`;
    loading.value = false;
  }
};

const processWeatherData = (data: any) => {
  weatherData.value = {
    location: data.name,
    temperature: Math.round(data.main.temp),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    feelsLike: Math.round(data.main.feels_like)
  };
  loading.value = false;
};

onMounted(() => {
  // 尝试获取用户位置
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        getWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        console.error('获取位置失败:', err);
        // 如果获取位置失败，使用默认城市
        getWeatherByCity(defaultCity);
      }
    );
  } else {
    // 如果浏览器不支持地理位置，使用默认城市
    getWeatherByCity(defaultCity);
  }
});

// 获取天气图标URL
const getWeatherIconUrl = (iconCode: string) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};
</script>

<template>
  <div class="weather-widget">
    <div class="weather-card">
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>正在获取天气数据...</p>
      </div>
      
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>
      
      <div v-else-if="weatherData" class="weather-content">
        <div class="weather-header">
          <h2>{{ weatherData.location }}</h2>
          <div class="weather-date">{{ new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</div>
        </div>
        
        <div class="weather-main">
          <div class="weather-temp-container">
            <div class="weather-temp">{{ weatherData.temperature }}°C</div>
            <div class="weather-feels-like">体感温度: {{ weatherData.feelsLike }}°C</div>
          </div>
          
          <div class="weather-icon-container">
            <img 
              :src="getWeatherIconUrl(weatherData.icon)" 
              :alt="weatherData.description" 
              class="weather-icon"
            />
            <div class="weather-description">{{ weatherData.description }}</div>
          </div>
        </div>
        
        <div class="weather-details">
          <div class="weather-detail-item">
            <div class="detail-label">湿度</div>
            <div class="detail-value">{{ weatherData.humidity }}%</div>
          </div>
          
          <div class="weather-detail-item">
            <div class="detail-label">风速</div>
            <div class="detail-value">{{ weatherData.windSpeed }} m/s</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-widget {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.weather-card {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  color: white;
  padding: 24px;
  overflow: hidden;
  position: relative;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 24px;
  color: #ffcccc;
}

.weather-header {
  margin-bottom: 24px;
}

.weather-header h2 {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
}

.weather-date {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 4px;
}

.weather-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.weather-temp {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
}

.weather-feels-like {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 8px;
}

.weather-icon-container {
  text-align: center;
}

.weather-icon {
  width: 80px;
  height: 80px;
}

.weather-description {
  text-transform: capitalize;
  font-size: 1rem;
  margin-top: 4px;
}

.weather-details {
  display: flex;
  justify-content: space-around;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
}

.weather-detail-item {
  text-align: center;
}

.detail-label {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 1.2rem;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .weather-main {
    flex-direction: column;
    text-align: center;
  }
  
  .weather-temp-container {
    margin-bottom: 16px;
  }
}
</style>