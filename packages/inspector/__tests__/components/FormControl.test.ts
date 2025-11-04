import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FormControl from '../../src/components/basic/FormControl.vue'

describe('formControl Component', () => {
  it('should render correctly', () => {
    const wrapper = mount(FormControl, {
      props: {
        modelValue: 'test-value',
        type: 'checkbox',
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should have checked state', () => {
    const wrapper = mount(FormControl, {
      props: {
        modelValue: 'test',
        type: 'checkbox',
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('checkbox')
  })

  it('should have correct initial checked state', () => {
    const wrapper = mount(FormControl, {
      props: {
        modelValue: 'test-value',
        type: 'checkbox',
      },
    })

    const input = wrapper.find('input')
    // 修复这个测试：对于 checkbox 类型，checked 属性更相关
    expect(input.element.checked).toBe(true)
  })

  it('should have correct props', () => {
    const wrapper = mount(FormControl, {
      props: {
        modelValue: 'test-value',
        type: 'checkbox',
      },
    })

    expect(wrapper.props('modelValue')).toBe('test-value')
    expect(wrapper.props('type')).toBe('checkbox')
  })
})
