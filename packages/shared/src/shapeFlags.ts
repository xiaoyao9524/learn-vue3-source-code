export const enum ShapeFlags {
  /**
   * type = element
   */
  ELEMENT = 1,
  /**
   * 函数组件
   */
  FUNCTIONAL_COMPONENT = 1 << 1,
  /**
   * 有状态（响应数据）的组件
   */
  STATEFUL_COMPONENT = 1 << 2,
  /**
   * type = text
   */
  TEXT_CHILDREN = 1 << 3,
  /**
   * children数组
   */
  ARRAY_CHILDREN = 1 << 4,
  /**
   * children = slot
   */
  SLOTS_CHILDREN = 1 << 5,
  /**
   * vue3 teleport内置组件
   */
  TELEPORT = 1 << 6,
  /**
   * vue3 suspense内置组件
   */
  SUSPENSE = 1 << 7,
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}
