import type { Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { useAttributes } from '../../src/composables/attributes'
import { useTracker } from '../../src/composables/exports/element'

interface TestComponentInstance {
  tracker: ReturnType<typeof useTracker>
  attributes: Ref<Map<string, { all: string[], active: string[] }>>
  updateAttribute: (attrName: string, newValues: string[]) => void
}

describe('useAttributes', () => {
  let wrapper: any

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('应该返回空Map当没有元素时', () => {
    const TestComponent = defineComponent({
      setup() {
        const tracker = useTracker()
        const { attributes } = useAttributes()
        return { tracker, attributes }
      },
      render() {
        return h('div')
      },
    })

    wrapper = mount(TestComponent)
    const vm = wrapper.vm as unknown as TestComponentInstance
    expect(vm.attributes.value.size).toBe(0)
  })

  it('应该读取元素的属性', async () => {
    const TestComponent = defineComponent({
      setup() {
        const tracker = useTracker()
        const { attributes } = useAttributes()
        return { tracker, attributes }
      },
      render() {
        return h('div', { 'data-test': 'value1 value2' })
      },
    })

    wrapper = mount(TestComponent)
    const el = wrapper.element as HTMLElement
    const vm = wrapper.vm as unknown as TestComponentInstance

    if (vm.tracker) {
      vm.tracker.element.value = el
      await nextTick()

      const attr = vm.attributes.value.get('data-test')
      expect(attr).toBeDefined()
      expect(attr?.active).toContain('value1')
      expect(attr?.active).toContain('value2')
    }
  })

  it('应该更新元素属性', async () => {
    const TestComponent = defineComponent({
      setup() {
        const tracker = useTracker()
        const { attributes, updateAttribute } = useAttributes()
        return { tracker, attributes, updateAttribute }
      },
      render() {
        return h('div', { 'data-test': 'value1' })
      },
    })

    wrapper = mount(TestComponent)
    const el = wrapper.element as HTMLElement
    const vm = wrapper.vm as unknown as TestComponentInstance

    if (vm.tracker) {
      vm.tracker.element.value = el
      await nextTick()

      // 更新属性
      vm.updateAttribute('data-test', ['value1', 'value2'])
      await nextTick()

      expect(el.getAttribute('data-test')).toBe('value1 value2')
    }
  })

  it('应该处理空属性', async () => {
    const TestComponent = defineComponent({
      setup() {
        const tracker = useTracker()
        const { attributes, updateAttribute } = useAttributes()
        return { tracker, attributes, updateAttribute }
      },
      render() {
        return h('div', { 'data-test': '' })
      },
    })

    wrapper = mount(TestComponent)
    const el = wrapper.element as HTMLElement
    const vm = wrapper.vm as unknown as TestComponentInstance

    if (vm.tracker) {
      vm.tracker.element.value = el
      await nextTick()

      const attr = vm.attributes.value.get('data-test')
      expect(attr).toBeDefined()
      expect(attr?.all).toContain('~') // ~ 是空值的占位符
    }
  })

  it('应该移除空值的属性', async () => {
    const TestComponent = defineComponent({
      setup() {
        const tracker = useTracker()
        const { updateAttribute } = useAttributes()
        return { tracker, updateAttribute }
      },
      render() {
        return h('div', { 'data-test': 'value1' })
      },
    })

    wrapper = mount(TestComponent)
    const el = wrapper.element as HTMLElement
    const vm = wrapper.vm as unknown as TestComponentInstance

    if (vm.tracker) {
      vm.tracker.element.value = el
      await nextTick()

      // 设置为空数组应该移除属性
      vm.updateAttribute('data-test', [])
      await nextTick()

      expect(el.hasAttribute('data-test')).toBe(false)
    }
  })
})
