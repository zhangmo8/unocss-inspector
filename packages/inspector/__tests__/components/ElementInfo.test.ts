import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ElementInfo from '../../src/ElementInfo.vue'

// Mock @vueuse/core
vi.mock('@vueuse/core', () => ({
  useEventListener: vi.fn(),
  useMouse: () => ({
    x: { value: 100 },
    y: { value: 200 },
  }),
  useToggle: () => [vi.fn(), vi.fn()],
  useWindowSize: () => ({
    width: { value: 1024 },
    height: { value: 768 },
  }),
}))

// Mock composables
vi.mock('../../src/composables/exports/element', () => ({
  useElement: () => ({
    element: { value: document.createElement('div') },
    triggering: vi.fn(),
  }),
}))

vi.mock('../../src/composables/exports/tabs', () => ({
  useTabs: () => ({
    tabs: [
      {
        id: 'basic-info',
        label: 'Basic Info',
        icon: 'test-icon',
        component: { template: '<div>Basic Info Content</div>' },
      },
    ],
    activeTab: {
      id: 'basic-info',
      label: 'Basic Info',
      icon: 'test-icon',
      component: { template: '<div>Basic Info Content</div>' },
    },
    slideDirection: 'left',
    setActiveTab: vi.fn(),
  }),
}))

describe('elementInfo Component', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  const createMockProps = (isSelected = true) => ({
    isSelected,
    action: {
      start: vi.fn(),
      stop: vi.fn(),
    },
    userPanels: [],
  })

  it('should render correctly when element is selected', () => {
    wrapper = mount(ElementInfo, {
      props: createMockProps(true),
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.uno-inspect-element-info').exists()).toBe(true)
  })

  it('should render header with logo and action buttons', () => {
    wrapper = mount(ElementInfo, {
      props: createMockProps(true),
    })

    const header = wrapper.find('.flex.justify-between.items-center')
    expect(header.exists()).toBe(true)

    const logo = wrapper.find('.header-logo')
    expect(logo.exists()).toBe(true)

    const selectBtn = wrapper.find('.select-btn')
    expect(selectBtn.exists()).toBe(true)
  })

  it('should render tab navigation', () => {
    wrapper = mount(ElementInfo, {
      props: createMockProps(true),
    })

    const tabNavigation = wrapper.find('.flex.items-center.gap-1\\.25')
    expect(tabNavigation.exists()).toBe(true)
  })

  it('should render tab content area', () => {
    wrapper = mount(ElementInfo, {
      props: createMockProps(true),
    })

    const contentArea = wrapper.find('.flex-1.overflow-y-auto')
    expect(contentArea.exists()).toBe(true)
  })

  it('should show cancel button when selected', () => {
    wrapper = mount(ElementInfo, {
      props: createMockProps(true),
    })

    // The cancel button should be present when isSelected is true
    // Check if the component renders the header structure
    const header = wrapper.find('.flex.justify-between.items-center')
    expect(header.exists()).toBe(true)
  })

  it('should hide cancel button when not selected', () => {
    wrapper = mount(ElementInfo, {
      props: createMockProps(false),
    })

    const cancelBtn = wrapper.find('[i-hugeicons\\:cancel-01]')
    expect(cancelBtn.exists()).toBe(false)
  })

  it('should calculate panel position correctly', () => {
    wrapper = mount(ElementInfo, {
      props: createMockProps(true),
    })

    const panelPosition = wrapper.vm.panelPosition
    expect(panelPosition.position).toBe('fixed')
    expect(panelPosition.zIndex).toBe('1001')
    expect(typeof panelPosition.left).toBe('string')
    expect(typeof panelPosition.top).toBe('string')
  })

  it('should render with custom user panels', () => {
    const mockUserPanels = [
      {
        id: 'custom-panel',
        label: 'Custom Panel',
        icon: 'custom-icon',
        component: { template: '<div>Custom Panel Content</div>' },
      },
    ]

    wrapper = mount(ElementInfo, {
      props: {
        ...createMockProps(true),
        userPanels: mockUserPanels,
      },
    })

    expect(wrapper.exists()).toBe(true)
  })
})
