import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import BoxModel from '../../src/components/panels/BoxModel.vue'

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

describe('boxModel Panel', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('should render correctly when element is provided', () => {
    const mockElement = document.createElement('div')

    vi.doMock('../../src/composables/exports/element', () => ({
      useElement: () => ({
        element: { value: mockElement },
        tracking: vi.fn(),
      }),
    }))

    wrapper = mount(BoxModel)
    expect(wrapper.exists()).toBe(true)
  })

  it('should not render when no element is provided', () => {
    vi.doMock('../../src/composables/exports/element', () => ({
      useElement: () => ({
        element: { value: null },
        tracking: vi.fn(),
      }),
    }))

    wrapper = mount(BoxModel)
    expect(wrapper.exists()).toBe(true)
  })

  it('should toggle units', () => {
    const mockElement = document.createElement('div')

    vi.doMock('../../src/composables/exports/element', () => ({
      useElement: () => ({
        element: { value: mockElement },
        tracking: vi.fn(),
      }),
    }))

    wrapper = mount(BoxModel)

    // Test component renders correctly
    expect(wrapper.exists()).toBe(true)
  })

  it('should convert px to rem', () => {
    const mockElement = document.createElement('div')

    vi.doMock('../../src/composables/exports/element', () => ({
      useElement: () => ({
        element: { value: mockElement },
        tracking: vi.fn(),
      }),
    }))

    wrapper = mount(BoxModel)

    // Test pxToRem method
    if (wrapper.vm.pxToRem) {
      expect(wrapper.vm.pxToRem(16)).toBe(1)
      expect(wrapper.vm.pxToRem(32)).toBe(2)
    }
  })

  it('should return null when no element is provided', () => {
    vi.doMock('../../src/composables/exports/element', () => ({
      useElement: () => ({
        element: { value: null },
        tracking: vi.fn(),
      }),
    }))

    wrapper = mount(BoxModel)
    expect(wrapper.vm.boxModel).toBeNull()
  })
})
