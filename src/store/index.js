import { defineStore } from 'pinia'

export const useStore = defineStore('mainStore', {
  state: () => {
    return {
      count: 0
    }
  },
  actions: {
    increment() {
      this.count++
    }
  }
})