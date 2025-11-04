import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FormControl from '../../src/components/basic/FormControl.vue'

describe('formControl Component', () => {
  it('应该正确渲染', () => {
    const wrapper = mount(FormControl, {
      props: {
        modelValue: 'test-value',
        type: 'checkbox',
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('应该接受checkbox类型', () => {
    const wrapper = mount(FormControl, {
      props: {
        modelValue: 'test',
        type: 'checkbox',
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('checkbox')
  })

  it('应该能设置值', () => {
    const wrapper = mount(FormControl, {
      props: {
        modelValue: 'test-value',
        type: 'checkbox',
      },
    })

    const input = wrapper.find('input')
    expect(input.element.value).toBe('test-value')
  })
})
