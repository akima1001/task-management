export const Guard = {
  isEmpty(value: unknown) {
    if (typeof value === 'undefined' || value === null || value === '') {
      return true
    }
    if (value instanceof Object && !Object.keys(value).length) {
      return true
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return true
      }
      if (value.every((item) => Guard.isEmpty(item))) {
        return true
      }
    }

    return false
  }
}
