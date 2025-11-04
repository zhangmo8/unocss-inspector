import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import BasicInfo from '../../src/components/panels/BasicInfo.vue'

// Mock @vueuse/core
vi.mock('@vueuse/core', () => ({
  useClipboard: () => ({
    copy: vi.fn(),
  }),
}))

// Mock composables
vi.mock('../../src/composables/exports/element', () => ({
  useElement: () => ({
    element: { value: null },
    tracking: vi.fn(),
  }),
}))

// Mock child components
vi.mock('../../src/components/sections/Cell.vue', () => ({
  default: {
    template: '<div class="mock-cell"><slot /></div>',
  },
}))

vi.mock('../../src/components/sections/ColorDot.vue', () => ({
  default: {
    template: '<div class="mock-color-dot" />',
    props: ['color'],
  },
}))

describe('basicInfo Panel', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('should render correctly', () => {
    const mockElement = document.createElement('div')
    Object.defineProperty(mockElement, 'tagName', { value: 'DIV' })

    vi.doMock('../../src/composables/exports/element', () => ({
      useElement: () => ({
        element: { value: mockElement },
        tracking: vi.fn(),
      }),
    }))

    wrapper = mount(BasicInfo)
    expect(wrapper.exists()).toBe(true)
  })

  it('should not render when no element', () => {
    vi.doMock('../../src/composables/exports/element', () => ({
      useElement: () => ({
        element: { value: null },
        tracking: vi.fn(),
      }),
    }))

    wrapper = mount(BasicInfo)
    expect(wrapper.find('[p-3]').exists()).toBe(false)
  })

  it('should toggle units', () => {
    const mockElement = document.createElement('div')
    Object.defineProperty(mockElement, 'tagName', { value: 'DIV' })

    vi.doMock('../../src/composables/exports/element', () => ({
      useElement: () => ({
        element: { value: mockElement },
        tracking: vi.fn(),
      }),
    }))

    wrapper = mount(BasicInfo)

    expect(wrapper.vm.showRem).toBe(false)
    wrapper.vm.toggleUnit()
    expect(wrapper.vm.showRem).toBe(true)
  })

  it('should convert px to rem', () => {
    const mockElement = document.createElement('div')
    Object.defineProperty(mockElement, 'tagName', { value: 'DIV' })

    vi.doMock('../../src/composables/exports/element', () => ({
      useElement: () => ({
        element: { value: mockElement },
        tracking: vi.fn(),
      }),
    }))

    wrapper = mount(BasicInfo)
    expect(String(wrapper.vm.pxToRem(32))).toBe('2')
    expect(String(wrapper.vm.pxToRem(16))).toBe('1')
  })
})
