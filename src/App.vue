<script setup lang="ts">
import SideNavigation from './components/SideNavigation.vue'
import WeatherWidget from './components/WeatherWidget.vue'
</script>

<template>
  <div class="app-container">
    <SideNavigation />
    <main class="main-content">
      <div class="dashboard-header">
        <div>
          <h1>AI Agents Dashboard</h1>
          <p>Welcome to your dashboard. Select an option from the side navigation.</p>
        </div>
      </div>
      
      <div class="dashboard-content">
        <section class="weather-section">
          <h2>今日天气</h2>
          <WeatherWidget />
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #f8fafc;
}

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #1A202C;
  margin-bottom: 0.5rem;
}

p {
  font-size: 1rem;
  color: #4A5568;
  line-height: 1.5;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr 1fr;
  }
}

.weather-section {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.weather-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1A202C;
  margin-bottom: 1rem;
}
</style>
