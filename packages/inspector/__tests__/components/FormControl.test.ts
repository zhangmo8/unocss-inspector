import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import FormControl from '../../src/components/basic/FormControl.vue'

describe('formControl Component', () => {
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
    wrapper = mount(FormControl, {
      props: {
        modelValue: true,
        type: 'checkbox',
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('should render with label', () => {
    wrapper = mount(FormControl, {
      props: {
        modelValue: false,
        type: 'checkbox',
        label: 'Test Label',
      },
    })

    expect(wrapper.find('label').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Label')
  })

  it('should render checkbox type by default', () => {
    wrapper = mount(FormControl, {
      props: { modelValue: false },
    })

    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('checkbox')
  })

  it('should render radio type when specified', () => {
    wrapper = mount(FormControl, {
      props: {
        modelValue: false,
        type: 'radio',
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('radio')
  })

  it('should be checked when modelValue is true', () => {
    wrapper = mount(FormControl, {
      props: {
        modelValue: true,
        type: 'checkbox',
      },
    })

    const input = wrapper.find('input')
    expect(input.element.checked).toBe(true)
  })

  it('should be unchecked when modelValue is false', () => {
    wrapper = mount(FormControl, {
      props: {
        modelValue: false,
        type: 'checkbox',
      },
    })

    const input = wrapper.find('input')
    expect(input.element.checked).toBe(false)
  })

  it('should toggle checkbox state on click', async () => {
    wrapper = mount(FormControl, {
      props: {
        modelValue: false,
        type: 'checkbox',
      },
    })

    const input = wrapper.find('input')
    expect(input.element.checked).toBe(false)

    await input.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([true])
  })

  it('should set radio to true on click', async () => {
    wrapper = mount(FormControl, {
      props: {
        modelValue: false,
        type: 'radio',
      },
    })

    const input = wrapper.find('input')
    await input.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([true])
  })

  it('should be disabled when disabled prop is true', () => {
    wrapper = mount(FormControl, {
      props: {
        modelValue: false,
        type: 'checkbox',
        disabled: true,
      },
    })

    const input = wrapper.find('input')
    expect(input.element.disabled).toBe(true)
  })

  it('should render with square shape by default', () => {
    wrapper = mount(FormControl, {
      props: { modelValue: false },
    })

    const controlContainer = wrapper.find('.inline-flex.items-center.relative')
    expect(controlContainer.exists()).toBe(true)
  })

  it('should render with round shape when specified', () => {
    wrapper = mount(FormControl, {
      props: {
        modelValue: false,
        shape: 'round',
      },
    })

    const input = wrapper.find('input')
    expect(input.classes()).toContain('rd-full')
  })

  it('should handle label click', async () => {
    wrapper = mount(FormControl, {
      props: {
        modelValue: false,
        type: 'checkbox',
        label: 'Test Label',
      },
    })

    const label = wrapper.find('label')
    await label.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('should generate unique id when not provided', () => {
    wrapper = mount(FormControl, {
      props: { modelValue: false },
    })

    const input = wrapper.find('input')
    expect(input.attributes('id')).toBeDefined()
    expect(input.attributes('id')).toMatch(/^[a-z0-9]+$/)
  })

  it('should use provided id', () => {
    wrapper = mount(FormControl, {
      props: {
        modelValue: false,
        id: 'test-id',
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('id')).toBe('test-id')
  })

  it('should handle string modelValue for groups', () => {
    wrapper = mount(FormControl, {
      props: {
        modelValue: 'option1',
        type: 'checkbox',
      },
    })

    // When no controlGroup is injected, string values should work as boolean
    expect(wrapper.exists()).toBe(true)
  })
})
