// following this example https://github.com/productdevbook/oku-nuxt3-template/tree/master/src
import { defineStore } from "pinia";
import { NoirInstanceState } from "./noir.types";
export const useNoirInstance = defineStore("noirInstance", {
  state: (): NoirInstanceState => ({
    noir: null,
    isLoaded: false,
  }),

  actions: {},
  getters: {},
});
