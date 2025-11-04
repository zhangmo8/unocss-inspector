import type { Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { useElement, useTracker } from '../../src/composables/exports/element'

interface TestComponentInstance {
  tracker?: ReturnType<typeof useTracker>
  element?: Ref<HTMLElement | null>
  error?: string
  setElementStyle?: (styles: Partial<CSSStyleDeclaration>, mode?: 'style' | 'class' | 'both') => void
  triggering?: () => void
}

describe('useElement', () => {
  let wrapper: any

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('应该抛出错误如果没有提供 element context', () => {
    const TestComponent = defineComponent({
      setup() {
        try {
          useElement()
        }
        catch (error) {
          return { error: (error as Error).message }
        }
        return {}
      },
      render() {
        return h('div')
      },
    })

    wrapper = mount(TestComponent)
    const vm = wrapper.vm as unknown as TestComponentInstance
    expect(vm.error).toContain('useElement must be used within a component')
  })

  it('应该正确返回 element ref', () => {
    const TestComponent = defineComponent({
      setup() {
        const tracker = useTracker()
        const { element } = useElement()
        return { tracker, element }
      },
      render() {
        return h('div')
      },
    })

    wrapper = mount(TestComponent)
    const vm = wrapper.vm as unknown as TestComponentInstance
    expect(vm.element?.value).toBeDefined()
    expect(vm.element?.value).toBe(null) // 初始为 null
  })

  it('应该能够设置元素样式', async () => {
    const TestComponent = defineComponent({
      setup() {
        const tracker = useTracker()
        const { element, setElementStyle } = useElement()
        return { tracker, element, setElementStyle }
      },
      render() {
        return h('div')
      },
    })

    wrapper = mount(TestComponent)
    const el = wrapper.element as HTMLElement
    const vm = wrapper.vm as unknown as TestComponentInstance

    if (vm.tracker) {
      vm.tracker.element.value = el
      await nextTick()

      // 设置样式
      vm.setElementStyle?.({ color: 'red', fontSize: '16px' })
      await nextTick()

      expect(el.style.color).toBe('red')
      expect(el.style.fontSize).toBe('16px')
    }
  })

  it('triggering 应该更新状态', async () => {
    const TestComponent = defineComponent({
      setup() {
        const tracker = useTracker()
        const { triggering } = useElement()
        return { tracker, triggering }
      },
      render() {
        return h('div')
      },
    })

    wrapper = mount(TestComponent)
    const el = wrapper.element as HTMLElement
    const vm = wrapper.vm as unknown as TestComponentInstance

    if (vm.tracker) {
      vm.tracker.element.value = el
      await nextTick()

      // triggering 应该不会抛出错误
      expect(() => vm.triggering?.()).not.toThrow()
    }
  })
})
