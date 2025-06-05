import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SideNavigation from '../SideNavigation.vue'

describe('SideNavigation', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(SideNavigation)
  })

  it('renders the component correctly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.side-navigation').exists()).toBe(true)
  })

  it('renders all menu sections', () => {
    const sections = wrapper.findAll('.side-navigation__section')
    expect(sections.length).toBe(2) // MENU and GENERAL sections
  })

  it('renders correct section titles', () => {
    const sectionTitles = wrapper.findAll('.side-navigation__section-title')
    expect(sectionTitles.length).toBe(2)
    expect(sectionTitles[0].text()).toBe('MENU')
    expect(sectionTitles[1].text()).toBe('GENERAL')
  })

  it('renders all menu items', () => {
    const menuItems = wrapper.findAll('.side-navigation__menu-item')
    expect(menuItems.length).toBe(8) // 5 in MENU + 3 in GENERAL
  })

  it('has Dashboard as the default active item', () => {
    const activeItems = wrapper.findAll('.side-navigation__menu-item--active')
    expect(activeItems.length).toBe(1)
    
    const activeItemText = activeItems[0].find('.side-navigation__menu-item-text')
    expect(activeItemText.text()).toBe('Dashboard')
  })

  it('changes active item when clicked', async () => {
    // Find all menu items
    const menuItems = wrapper.findAll('.side-navigation__menu-item')
    
    // Click on the second item (My Asset)
    await menuItems[1].trigger('click')
    
    // Check if the active class is applied to the clicked item
    expect(menuItems[1].classes()).toContain('side-navigation__menu-item--active')
    
    // Check if the text of the active item is correct
    const activeItemText = menuItems[1].find('.side-navigation__menu-item-text')
    expect(activeItemText.text()).toBe('My Asset')
    
    // Check if the indicator is shown for the active item
    const indicator = menuItems[1].find('.side-navigation__menu-item-indicator')
    expect(indicator.exists()).toBe(true)
  })

  it('shows the indicator only for the active item', async () => {
    // Initially only Dashboard should have the indicator
    let indicators = wrapper.findAll('.side-navigation__menu-item-indicator')
    expect(indicators.length).toBe(1)
    
    // Click on another item
    const menuItems = wrapper.findAll('.side-navigation__menu-item')
    await menuItems[2].trigger('click') // Click on Analytics
    
    // Now only Analytics should have the indicator
    indicators = wrapper.findAll('.side-navigation__menu-item-indicator')
    expect(indicators.length).toBe(1)
    
    const activeItem = wrapper.find('.side-navigation__menu-item--active')
    const activeItemText = activeItem.find('.side-navigation__menu-item-text')
    expect(activeItemText.text()).toBe('Analytics')
  })
})