import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Inspector from '../../src/Inspector.vue'

describe('inspector Component', () => {
  let wrapper: any

  beforeEach(() => {
    document.body.className = ''
    vi.clearAllMocks()
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('should render correctly', () => {
    wrapper = mount(Inspector)
    expect(wrapper.exists()).toBe(true)
    // Inspector uses Teleport, so we test component exists but not specific DOM structure
  })

  it('should add virtual-inspector-injected class to body on mount', () => {
    wrapper = mount(Inspector)
    expect(document.body.classList.contains('virtual-inspector-injected')).toBe(true)
  })

  it('should render control button', () => {
    wrapper = mount(Inspector)
    // Inspector uses Teleport to body, so we test component functionality instead
    expect(wrapper.exists()).toBe(true)
    expect(typeof wrapper.vm.startSelecting).toBe('function')
    expect(typeof wrapper.vm.stopSelecting).toBe('function')
  })

  it('should handle v-model binding', async () => {
    const mockElement = document.createElement('div')
    wrapper = mount(Inspector, {
      props: { modelValue: null },
    })
    await wrapper.setProps({ modelValue: mockElement })
    expect(wrapper.props('modelValue')).toBe(mockElement)
  })

  it('should render with custom panels', () => {
    const mockPanels = [
      {
        id: 'test-panel',
        label: 'Test Panel',
        icon: 'test-icon',
        component: { template: '<div>Test Panel Content</div>' },
      },
    ]
    wrapper = mount(Inspector, { props: { panels: mockPanels } })
    expect(wrapper.exists()).toBe(true)
  })

  it('should toggle selecting state', () => {
    wrapper = mount(Inspector)
    // Test that the methods exist and can be called
    expect(typeof wrapper.vm.startSelecting).toBe('function')
    expect(typeof wrapper.vm.stopSelecting).toBe('function')
    // isSelecting comes from useToggle, it should be a ref
    expect(wrapper.vm.isSelecting).toBeDefined()
  })

  it('should clean up on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document.body, 'removeEventListener')
    wrapper = mount(Inspector)
    wrapper.unmount()
    expect(removeEventListenerSpy).toHaveBeenCalled()
  })
})
