// following this example https://github.com/productdevbook/oku-nuxt3-template/tree/master/src
import { defineStore } from "pinia";
import { ProofState } from "./demoProof.types";
import { useNoirInstance } from "~/store/noir/noir.index";

export const useDemoProof = defineStore("demoProof", {
  state: (): ProofState => ({
    proofs: [],
    privateInputX: 0,
    publicInputY: 2,
    verifierAddress: "0xD6bD14131D4d426b9d8B38C42CE7328100510691",
  }),

  actions: {
    computeProof: async function () {
      const startOverall = Date.now(); // Start timing
      console.log("Starting function...");
      const noirStore = useNoirInstance();

      const input = {
        x: parseInt(this.privateInputX.toString()),
        y: parseInt(this.publicInputY.toString()),
      };

      console.log(input);
      try {
        const startGenerateWitness = Date.now();
        const witness = await noirStore.noir.generateWitness(input);
        const endGenerateWitness = Date.now();
        console.log(
          "Time to generate witness:",
          endGenerateWitness - startGenerateWitness,
          "ms"
        );
        const startGenerateProof = Date.now();

        const proof = await noirStore.noir.generateProof(witness);

        const endGenerateProof = Date.now();
        console.log(
          "Time to generate proof:",
          endGenerateProof - startGenerateProof,
          "ms"
        );

        const proofMeta = {
          data: proof,
          computationTime: endGenerateProof - startGenerateProof,
          parameters: input,
          description: "",
        };

        this.proofs.push(proofMeta);
      } catch (err) {
        console.log(err);
      }
    },
    verifyProof: async function () {
      // await noir.value.generateWitness(input);
      const noirStore = useNoirInstance();
      if (this.proofs && this.proofs.length > 0) {
        try {
          const verification = await noirStore.noir.verifyProof(
            // @ts-ignore
            this.proofs[0].data
          );
          console.log(verification);
          const proofMeta = { ...this.proofs[0], verified: true };
          console.log(proofMeta);
        } catch (err) {
          console.log("Error verifying your proof");
        } finally {
          noirStore.noir.destroy();
        }
      }
    },
  },
  getters: {},
});
