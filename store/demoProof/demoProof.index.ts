// following this example https://github.com/productdevbook/oku-nuxt3-template/tree/master/src
import { defineStore } from "pinia";
import { ProofState } from "./demoProof.types";
import { useNoirInstance } from "~/store/noir/noir.index";
import { ultraVerifierAbi } from "~/utils/noir/abi/UltraVerifier";
import { ethers } from "ethers";
export const useDemoProof = defineStore("demoProof", {
  state: (): ProofState => ({
    proof: null,
    privateInputX: 0,
    publicInputY: 2,
    verifierAddress: "0x668C963776248b95aD19e33522A1125edbAfD004",
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

        this.proof = proofMeta;
      } catch (err) {
        throw new Error(err);
      }
    },
    verifyProof: async function () {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const noirStore = useNoirInstance();
      if (this.proof) {
        try {
          const verification = await noirStore.noir.verifyProof(
            // @ts-ignore
            this.proof.data
          );
          console.log("verification result:", verification);

          // @ts-ignore
          const publicInputs = this.proof.data.slice(0, 32);
          // @ts-ignore
          const slicedProof = this.proof.data.slice(32);

          let contract = new ethers.Contract(
            this.verifierAddress,
            ultraVerifierAbi,
            provider.getSigner()
          );

          const ver = await contract.verify(slicedProof, [publicInputs]);
          console.log("on chain verification result:", ver);

          const toast = useToast();

          const proofMeta = { ...this.proof, verified: true };
          this.proof = proofMeta;
        } catch (err) {
          console.log("Error verifying your proof", err);
        } finally {
          noirStore.noir.destroy();
        }
      }
    },
  },
  getters: {},
});
