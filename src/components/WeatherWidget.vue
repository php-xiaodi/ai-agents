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
  date: string;
}

const weatherData = ref<WeatherData | null>(null);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const defaultCity = 'Beijing'; // 默认城市改为北京

// 天气图标映射表
const weatherIconMap: Record<string, string> = {
  '晴': '01d',
  '多云': '02d',
  '阴': '03d',
  '阵雨': '09d',
  '雷阵雨': '11d',
  '雨夹雪': '13d',
  '小雨': '10d',
  '中雨': '10d',
  '大雨': '10d',
  '暴雨': '10d',
  '雪': '13d',
  '小雪': '13d',
  '中雪': '13d',
  '大雪': '13d',
  '雾': '50d',
  '霾': '50d'
};

// 使用中华万年历天气API，无需API密钥
const getWeatherByCity = async (city: string) => {
  try {
    // 使用中华万年历天气API
    const response = await fetch(
      `https://wthrcdn.etouch.cn/weather_mini?city=${encodeURIComponent(city)}`
    );
    
    if (!response.ok) {
      throw new Error(`无法获取${city}的天气数据`);
    }
    
    const data = await response.json();
    if (data.status === 1000) {
      processWeatherData(data.data, city);
    } else {
      throw new Error(data.desc || `无法获取${city}的天气数据`);
    }
  } catch (err) {
    console.error('获取天气数据失败:', err);
    error.value = `获取${city}的天气数据失败，请稍后再试`;
    loading.value = false;
  }
};

const processWeatherData = (data: any, city: string) => {
  // 处理中华万年历API返回的数据
  const today = data.forecast[0];
  const description = today.type;
  
  // 从高温低温字符串中提取数字
  const highTemp = parseInt(today.high.replace(/[^0-9]/g, ''));
  const lowTemp = parseInt(today.low.replace(/[^0-9]/g, ''));
  const avgTemp = Math.round((highTemp + lowTemp) / 2);
  
  // 从风力字符串中提取风速
  const windSpeed = today.fengli.replace(/[\[\]]/g, '');
  
  weatherData.value = {
    location: city,
    temperature: avgTemp,
    description: description,
    icon: getWeatherIconCode(description),
    humidity: data.shidu ? parseInt(data.shidu.replace('%', '')) : 50, // 如果有湿度数据则使用，否则默认值
    windSpeed: windSpeed,
    feelsLike: avgTemp, // 中华万年历API没有体感温度，使用平均温度代替
    date: today.date
  };
  loading.value = false;
};

// 根据天气描述获取对应的图标代码
const getWeatherIconCode = (description: string): string => {
  return weatherIconMap[description] || '01d'; // 默认晴天图标
};

// 根据经纬度获取城市名称
const getCityNameByLocation = async (latitude: number, longitude: number): Promise<string | null> => {
  try {
    // 注意：实际使用时需要申请腾讯位置服务API密钥
    // 这里使用的是示例URL，实际使用时请替换为您的API密钥
    const response = await fetch(
      `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=YOUR_KEY_HERE`
    );
    
    if (!response.ok) {
      throw new Error('无法获取位置信息');
    }
    
    const data = await response.json();
    if (data.status === 0) {
      // 返回城市名称
      return data.result.address_component.city.replace('市', '');
    } else {
      throw new Error(data.message || '获取城市名称失败');
    }
  } catch (err) {
    console.error('获取城市名称失败:', err);
    return null;
  }
};

onMounted(() => {
  // 尝试获取用户位置
  if (navigator.geolocation) {
    loading.value = true;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          console.log('获取到用户位置:', latitude, longitude);
          
          // 尝试获取城市名称
          const cityName = await getCityNameByLocation(latitude, longitude);
          
          if (cityName) {
            console.log('获取到城市名称:', cityName);
            getWeatherByCity(cityName);
          } else {
            console.log('无法获取城市名称，使用默认城市');
            getWeatherByCity(defaultCity);
          }
        } catch (err) {
          console.error('处理位置信息失败:', err);
          getWeatherByCity(defaultCity);
        }
      },
      (err) => {
        console.error('获取位置失败:', err);
        // 如果获取位置失败，使用默认城市
        getWeatherByCity(defaultCity);
      },
      { timeout: 10000, enableHighAccuracy: false } // 设置超时时间和精度
    );
  } else {
    // 如果浏览器不支持地理位置，使用默认城市
    console.log('浏览器不支持地理位置API，使用默认城市');
    getWeatherByCity(defaultCity);
  }
});

// 获取天气图标URL，仍使用OpenWeatherMap的图标
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
          <div class="weather-date">{{ weatherData.date }}</div>
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
            <div class="detail-label">风力</div>
            <div class="detail-value">{{ weatherData.windSpeed }}</div>
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