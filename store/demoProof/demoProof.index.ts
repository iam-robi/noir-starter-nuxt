// following this example https://github.com/productdevbook/oku-nuxt3-template/tree/master/src
import { defineStore } from "pinia";
import { ProofState } from "./demoProof.types";

export const useDemoProof = defineStore("demoProof", {
  state: (): ProofState => ({
    proof: null,
    privateInputX: 0,
    publicInputY: 2,
  }),

  actions: {},
  getters: {},
});
