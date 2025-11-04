import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Select from '../../src/components/basic/Select.vue'

// Mock @vueuse/core
vi.mock('@vueuse/core', () => ({
  useEventListener: vi.fn(),
}))

describe('select Component', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  const defaultOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]

  it('should render correctly', () => {
    wrapper = mount(Select, {
      props: { options: defaultOptions },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.select-trigger').exists()).toBe(true)
  })

  it('should show placeholder', () => {
    wrapper = mount(Select, {
      props: {
        options: defaultOptions,
        placeholder: 'Select something...',
      },
    })
    expect(wrapper.text()).toContain('Select something...')
  })

  it('should toggle dropdown', async () => {
    wrapper = mount(Select, {
      props: { options: defaultOptions },
    })

    expect(wrapper.vm.isOpen).toBe(false)

    const trigger = wrapper.find('.select-trigger')
    await trigger.trigger('click')

    expect(wrapper.vm.isOpen).toBe(true)
  })

  it('should select option', async () => {
    wrapper = mount(Select, {
      props: { options: defaultOptions },
    })

    // Open dropdown
    const trigger = wrapper.find('.select-trigger')
    await trigger.trigger('click')

    // Select option
    const option = wrapper.find('[class*="hover:bg-white"]')
    await option.trigger('click')

    expect(wrapper.vm.modelValue).toBe('option1')
  })

  it('should handle v-model', async () => {
    wrapper = mount(Select, {
      props: {
        options: defaultOptions,
        modelValue: 'option2',
      },
    })

    expect(wrapper.vm.modelValue).toBe('option2')
  })

  it('should be disabled', async () => {
    wrapper = mount(Select, {
      props: {
        options: defaultOptions,
        disabled: true,
      },
    })

    const trigger = wrapper.find('.select-trigger')
    await trigger.trigger('click')

    expect(wrapper.vm.isOpen).toBe(false)
  })

  it('should render in inputable mode', () => {
    wrapper = mount(Select, {
      props: {
        options: defaultOptions,
        inputable: true,
      },
    })

    const input = wrapper.find('input[name="select-input"]')
    expect(input.exists()).toBe(true)
  })
})
