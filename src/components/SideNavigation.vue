<script setup lang="ts">
import { ref } from 'vue';

interface MenuItem {
  id: string;
  name: string;
  icon: string;
  active?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections = ref<MenuSection[]>([
  {
    title: 'MENU',
    items: [
      { id: 'dashboard', name: 'Dashboard', icon: 'home', active: true },
      { id: 'asset', name: 'My Asset', icon: 'wallet' },
      { id: 'analytics', name: 'Analytics', icon: 'chart' },
      { id: 'history', name: 'History', icon: 'time' },
      { id: 'news', name: 'News', icon: 'news' },
    ]
  },
  {
    title: 'GENERAL',
    items: [
      { id: 'help', name: 'Help', icon: 'info' },
      { id: 'settings', name: 'Settings', icon: 'settings' },
      { id: 'logout', name: 'Logout', icon: 'logout' },
    ]
  }
]);

const activeItem = ref<string>('dashboard');

const setActive = (itemId: string) => {
  activeItem.value = itemId;
};
</script>

<template>
  <aside class="side-navigation">
    <div class="side-navigation__bg"></div>
    
    <div class="side-navigation__content">
      <div 
        v-for="(section, sectionIndex) in menuSections" 
        :key="`section-${sectionIndex}`"
        class="side-navigation__section"
      >
        <h3 class="side-navigation__section-title">{{ section.title }}</h3>
        
        <div class="side-navigation__menu">
          <div 
            v-for="item in section.items" 
            :key="item.id"
            class="side-navigation__menu-item"
            :class="{ 'side-navigation__menu-item--active': activeItem === item.id }"
            @click="setActive(item.id)"
          >
            <div class="side-navigation__menu-item-bg"></div>
            
            <div class="side-navigation__menu-item-content">
              <div class="side-navigation__menu-item-icon">
                <div class="side-navigation__menu-item-icon-bg"></div>
                <img 
                  v-if="item.icon === 'home'" 
                  class="side-navigation__menu-item-icon-svg home-icon" 
                  src="../assets/icons/home-vector-1.svg" 
                  alt="Home icon"
                />
                <img 
                  v-else-if="item.icon === 'wallet'" 
                  class="side-navigation__menu-item-icon-svg" 
                  src="../assets/icons/wallet-icon.svg" 
                  alt="Wallet icon"
                />
                <img 
                  v-else-if="item.icon === 'chart'" 
                  class="side-navigation__menu-item-icon-svg" 
                  src="../assets/icons/chart-icon.svg" 
                  alt="Chart icon"
                />
                <img 
                  v-else-if="item.icon === 'time'" 
                  class="side-navigation__menu-item-icon-svg" 
                  src="../assets/icons/time-icon.svg" 
                  alt="Time icon"
                />
                <img 
                  v-else-if="item.icon === 'news'" 
                  class="side-navigation__menu-item-icon-svg" 
                  src="../assets/icons/news-icon.svg" 
                  alt="News icon"
                />
                <img 
                  v-else-if="item.icon === 'info'" 
                  class="side-navigation__menu-item-icon-svg" 
                  src="../assets/icons/info-icon.svg" 
                  alt="Info icon"
                />
                <img 
                  v-else-if="item.icon === 'settings'" 
                  class="side-navigation__menu-item-icon-svg" 
                  src="../assets/icons/settings-icon.svg" 
                  alt="Settings icon"
                />
                <img 
                  v-else-if="item.icon === 'logout'" 
                  class="side-navigation__menu-item-icon-svg" 
                  src="../assets/icons/logout-icon.svg" 
                  alt="Logout icon"
                />
              </div>
              <span class="side-navigation__menu-item-text">{{ item.name }}</span>
            </div>
            
            <div v-if="activeItem === item.id" class="side-navigation__menu-item-indicator"></div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.side-navigation {
  position: relative;
  width: 256px;
  height: 100vh;
  font-family: 'Poppins', sans-serif;
}

.side-navigation__bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #FFFFFF;
  box-shadow: 24px 0px 80px 0px rgba(49, 79, 124, 0.02);
  z-index: 1;
}

.side-navigation__content {
  position: relative;
  z-index: 2;
  padding: 32px 16px;
  height: 100%;
  overflow-y: auto;
}

.side-navigation__section {
  margin-bottom: 32px;
}

.side-navigation__section-title {
  font-size: 14px;
  font-weight: 400;
  color: #8F98B7;
  margin: 0 0 16px 16px;
  line-height: 1.7em;
}

.side-navigation__menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.side-navigation__menu-item {
  position: relative;
  height: 56px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.side-navigation__menu-item-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: rgba(244, 246, 248, 0.73);
  z-index: 1;
}

.side-navigation__menu-item-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 100%;
}

.side-navigation__menu-item-icon {
  position: relative;
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.side-navigation__menu-item-icon-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border: 1px solid transparent;
  z-index: 1;
}

.side-navigation__menu-item--active .side-navigation__menu-item-icon-bg {
  background: linear-gradient(135deg, #1CAC70 0%, #EDDC46 100%);
  border: none;
}

.side-navigation__menu-item:not(.side-navigation__menu-item--active) .side-navigation__menu-item-icon-bg {
  border-color: rgba(143, 152, 183, 0.5);
}

.side-navigation__menu-item-icon-svg {
  position: relative;
  z-index: 2;
  width: 16px;
  height: 16px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.home-icon {
  width: 18px;
  height: 18px;
}

.side-navigation__menu-item-text {
  font-size: 14px;
  font-weight: 500;
  color: #8F98B7;
}

.side-navigation__menu-item--active .side-navigation__menu-item-text {
  color: #1A202C;
}

.side-navigation__menu-item-indicator {
  position: absolute;
  right: 13px;
  top: 50%;
  transform: translateY(-50%);
  width: 14.5px;
  height: 29px;
  background: linear-gradient(135deg, #1CAC70 0%, #EDDC46 100%);
  border-radius: 20px;
  z-index: 2;
}
</style>