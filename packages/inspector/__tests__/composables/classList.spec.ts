import type { ComputedRef, Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { useClassList } from '../../src/composables/classList'
import { useTracker } from '../../src/composables/exports/element'

interface TestComponentInstance {
  tracker: ReturnType<typeof useTracker>
  displayClasses: ComputedRef<string[]>
  classList: Ref<string[]>
}

describe('useClassList', () => {
  let wrapper: any

  beforeEach(() => {
    // 清理 DOM
    document.body.innerHTML = ''
  })

  it('应该返回空数组当没有元素时', () => {
    const TestComponent = defineComponent({
      setup() {
        const tracker = useTracker()
        const { displayClasses, classList } = useClassList()
        return { tracker, displayClasses, classList }
      },
      render() {
        return h('div')
      },
    })

    wrapper = mount(TestComponent)
    const vm = wrapper.vm as unknown as TestComponentInstance
    expect(vm.displayClasses.value).toEqual([])
  })

  it('应该读取元素的类列表', async () => {
    const TestComponent = defineComponent({
      setup() {
        const tracker = useTracker()
        const { displayClasses, classList } = useClassList()
        return { tracker, displayClasses, classList }
      },
      render() {
        return h('div', { class: 'test-class another-class' })
      },
    })

    wrapper = mount(TestComponent)
    const el = wrapper.element
    const vm = wrapper.vm as unknown as TestComponentInstance

    if (vm.tracker) {
      vm.tracker.element.value = el as HTMLElement
      await nextTick()

      expect(vm.classList.value).toContain('test-class')
      expect(vm.classList.value).toContain('another-class')
    }
  })

  it('应该更新元素的类列表', async () => {
    const TestComponent = defineComponent({
      setup() {
        const tracker = useTracker()
        const { displayClasses, classList } = useClassList()
        return { tracker, displayClasses, classList }
      },
      render() {
        return h('div', { class: 'test-class' })
      },
    })

    wrapper = mount(TestComponent)
    const el = wrapper.element as HTMLElement
    const vm = wrapper.vm as unknown as TestComponentInstance

    if (vm.tracker) {
      vm.tracker.element.value = el
      await nextTick()

      // 更新类列表
      vm.classList.value = ['test-class', 'new-class']
      await nextTick()

      expect(el.classList.contains('test-class')).toBe(true)
      expect(el.classList.contains('new-class')).toBe(true)
    }
  })

  it('应该保持类的原始顺序', async () => {
    const TestComponent = defineComponent({
      setup() {
        const tracker = useTracker()
        const { displayClasses, classList } = useClassList()
        return { tracker, displayClasses, classList }
      },
      render() {
        return h('div', { class: 'class-a class-b class-c' })
      },
    })

    wrapper = mount(TestComponent)
    const el = wrapper.element as HTMLElement
    const vm = wrapper.vm as unknown as TestComponentInstance

    if (vm.tracker) {
      vm.tracker.element.value = el
      await nextTick()

      // 先移除一个类，再添加回来
      vm.classList.value = ['class-a', 'class-c']
      await nextTick()

      vm.classList.value = ['class-a', 'class-b', 'class-c']
      await nextTick()

      expect(el.className).toBe('class-a class-b class-c')
    }
  })
})
