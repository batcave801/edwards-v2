import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state(){
    return {
      sound: true
    }
  },
  actions: {
    toggleSound(){
      this.$state.sound = !this.$state.sound;
    }
  }
})
