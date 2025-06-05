<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: string;
  feelsLike: number;
  date: string;
}

const weatherData = ref<WeatherData | null>(null);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const defaultCity = 'Beijing'; // 默认城市
const defaultLocation = { latitude: 39.9093, longitude: 116.3964 }; // 北京的经纬度

// 百度地图API密钥 - 请替换为您自己的AK
const BAIDU_MAP_AK = ''; // 请在百度地图开放平台申请：http://lbsyun.baidu.com/apiconsole/key
const hasValidApiKey = BAIDU_MAP_AK.length > 0;

// 天气图标映射表 - 适配百度天气API的天气类型
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
  '大暴雨': '10d',
  '特大暴雨': '10d',
  '阵雪': '13d',
  '小雪': '13d',
  '中雪': '13d',
  '大雪': '13d',
  '暴雪': '13d',
  '雾': '50d',
  '霾': '50d',
  '沙尘暴': '50d',
  '浮尘': '50d',
  '扬沙': '50d',
  '强沙尘暴': '50d'
};

// 使用百度地图天气API获取天气数据
const getWeatherByLocation = async (latitude: number, longitude: number) => {
  try {
    loading.value = true;
    error.value = null;
    
    // 检查API密钥是否已设置
    if (!hasValidApiKey) {
      console.warn('未设置百度地图API密钥，使用模拟数据');
      // 使用模拟数据
      useMockWeatherData();
      return;
    }
    
    // 使用百度地图天气API
    const response = await fetch(
      `https://api.map.baidu.com/weather/v1/?district_id=&data_type=all&ak=${BAIDU_MAP_AK}&location=${longitude},${latitude}`
    );
    
    if (!response.ok) {
      throw new Error(`无法获取天气数据`);
    }
    
    const data = await response.json();
    
    if (data.status !== 0) {
      throw new Error(`获取天气数据失败: ${data.message || '未知错误'}`);
    }
    
    processWeatherData(data);
  } catch (err) {
    console.error('获取天气数据失败:', err);
    error.value = err instanceof Error ? err.message : '获取天气数据失败，请稍后再试';
    loading.value = false;
  }
};

const processWeatherData = (data: any) => {
  // 处理百度地图天气API返回的数据
  try {
    const result = data.result;
    const now = result.now;
    const location = result.location;
    const forecast = result.forecasts[0]; // 获取今天的天气预报
    const weatherType = now.text; // 天气类型，如：晴、多云等
    const iconCode = getWeatherIconCode(weatherType);
    
    weatherData.value = {
      location: location.city + location.name, // 城市名称
      temperature: now.temp, // 当前温度
      description: weatherType,
      icon: iconCode,
      humidity: now.rh, // 湿度
      windSpeed: `${now.wind_dir} ${now.wind_class}`, // 风向和风力
      feelsLike: now.feels_like, // 体感温度
      date: forecast.date + ' ' + forecast.week // 日期和星期
    };
  } catch (err) {
    console.error('处理天气数据失败:', err);
    error.value = '处理天气数据失败，数据格式可能有变化';
  }
  loading.value = false;
};

// 根据天气描述获取对应的图标代码
const getWeatherIconCode = (weatherType: string): string => {
  return weatherIconMap[weatherType] || '01d'; // 默认晴天图标
};

// 使用模拟数据（当没有API密钥时）
const useMockWeatherData = () => {
  setTimeout(() => {
    try {
      // 模拟北京的天气数据
      const mockData = {
        location: {
          city: '北京市',
          name: '朝阳区'
        },
        now: {
          temp: 25,
          feels_like: 26,
          rh: 40,
          wind_dir: '东南风',
          wind_class: '3级',
          text: '晴'
        },
        forecasts: [
          {
            date: '2023-06-05',
            week: '星期一',
            high: 28,
            low: 18
          }
        ]
      };
      
      weatherData.value = {
        location: mockData.location.city + mockData.location.name,
        temperature: mockData.now.temp,
        description: mockData.now.text,
        icon: getWeatherIconCode(mockData.now.text),
        humidity: mockData.now.rh,
        windSpeed: `${mockData.now.wind_dir} ${mockData.now.wind_class}`,
        feelsLike: mockData.now.feels_like,
        date: mockData.forecasts[0].date + ' ' + mockData.forecasts[0].week
      };
    } catch (err) {
      console.error('处理模拟数据失败:', err);
      error.value = '处理模拟数据失败';
    }
    loading.value = false;
  }, 1000); // 模拟网络延迟
};

// 刷新天气数据
const refreshWeather = async () => {
  try {
    // 检查API密钥是否已设置
    if (!hasValidApiKey) {
      console.warn('未设置百度地图API密钥，使用模拟数据');
      loading.value = true;
      error.value = null;
      useMockWeatherData();
      return;
    }
    
    if (navigator.geolocation) {
      loading.value = true;
      error.value = null;
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            console.log('获取到用户位置:', latitude, longitude);
            
            // 使用用户的位置获取天气
            getWeatherByLocation(latitude, longitude);
          } catch (err) {
            console.error('处理位置信息失败:', err);
            // 如果处理位置失败，使用默认位置
            getWeatherByLocation(defaultLocation.latitude, defaultLocation.longitude);
          }
        },
        (err) => {
          console.error('获取位置失败:', err);
          // 如果获取位置失败，使用默认位置
          getWeatherByLocation(defaultLocation.latitude, defaultLocation.longitude);
        },
        { timeout: 10000, enableHighAccuracy: false } // 设置超时时间和精度
      );
    } else {
      // 如果浏览器不支持地理位置，使用默认位置
      console.log('浏览器不支持地理位置API，使用默认位置');
      getWeatherByLocation(defaultLocation.latitude, defaultLocation.longitude);
    }
  } catch (err) {
    console.error('刷新天气数据失败:', err);
    error.value = '刷新天气数据失败，请稍后再试';
    loading.value = false;
  }
};

onMounted(() => {
  // 初始化时获取天气数据
  refreshWeather();
});

// 获取天气图标URL，使用OpenWeatherMap的图标
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
        <button @click="refreshWeather" class="refresh-button">重新获取</button>
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
        
        <div class="weather-footer">
          <button @click="refreshWeather" class="refresh-button small">
            <span class="refresh-icon">↻</span> 刷新
          </button>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
  justify-content: center;
}

.refresh-button {
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 16px;
  transition: background-color 0.3s;
}

.refresh-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.refresh-button.small {
  padding: 4px 12px;
  font-size: 0.8rem;
}

.refresh-icon {
  display: inline-block;
  margin-right: 4px;
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
  margin-bottom: 16px;
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

.weather-footer {
  display: flex;
  justify-content: flex-end;
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