<script setup lang="ts">
import SideNavigation from './components/SideNavigation.vue'
</script>

<template>
  <div class="app-container">
    <SideNavigation />
    <main class="main-content">
      <h1>AI Agents Dashboard</h1>
      <p>Welcome to your dashboard. Select an option from the side navigation.</p>
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

h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #1A202C;
  margin-bottom: 1rem;
}

p {
  font-size: 1rem;
  color: #4A5568;
  line-height: 1.5;
}
</style>
