<template>
  <div>
    <Navbar></Navbar>
    <LayoutHeroBanner></LayoutHeroBanner>
    helloo {{ h }}

    <div class="flex justify-center items-center">
      <div class="w-full max-w-md p-10 card rounded-box">
        <!-- Card content goes here -->
        <div class="flex flex-col space-y-4">
          <label for="input1" class="text-lg font-bold">Input X: </label>
          <input
            id="input1"
            type="text"
            class="input input-primary"
            placeholder="Enter input X"
            v-model.value="demoProofStore.privateInputX"
          />

          <label for="input2" class="text-lg font-bold">Input Y:</label>
          <input
            id="input2"
            type="text"
            class="input input-primary"
            placeholder="Enter input Y"
            v-model.value="demoProofStore.publicInputY"
          />
          <button @click="initializeNoir" class="btn">init</button>
          <button @click="calculateProof" class="btn">calculateProof</button>
          <button @click="verifyProof" class="btn">verify proof</button>

          <div>Proof (random string for now) {{ proof }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from "./components/layout/Navbar.vue";
import LayoutHeroBanner from "./components/layout/HeroBanner.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { NoirBrowser } from "~/utils/noir/noirBrowser";
import { useDemoProof } from "/store/demoProof/demoProof.index";
const demoProofStore = useDemoProof();
const noir = ref(null);
const proof = ref(null);

const h = ref("1");

const input = { x: 1, y: 0 };
const initializeNoir = async () => {
  if (!noir.value) {
    noir.value = new NoirBrowser();
  }
  await noir.value.init();
  h.value = "2";
};
const calculateProof = async () => {
  const startOverall = Date.now(); // Start timing
  console.log("Starting function...");
  if (!noir.value) {
    noir.value = new NoirBrowser();
  }

  console.log(noir.value);

  try {
    const startGenerateWitness = Date.now();
    const witness = await noir.value.generateWitness(input);
    const endGenerateWitness = Date.now();
    console.log(
      "Time to generate witness:",
      endGenerateWitness - startGenerateWitness,
      "ms"
    );
    const startGenerateProof = Date.now();

    proof.value = await noir.value.generateProof(witness);
    const endGenerateProof = Date.now();
    console.log(
      "Time to generate proof:",
      endGenerateProof - startGenerateProof,
      "ms"
    );

    console.log(proof);
  } catch (err) {
    console.log(err);
  }
  // await noir.value.generateWitness(input);
  h.value = "3";
};

const verifyProof = async () => {
  console.log(proof.value);

  // await noir.value.generateWitness(input);
  if (proof.value) {
    try {
      const verification = await noir.value.verifyProof(proof.value);
      console.log(verification);
      //const ethers = new Ethers();
      // const publicInputs = proof.value.slice(0, 32);
      // const slicedProof = proof.value.slice(32);

      // const ver = await ethers.contract.verify(slicedProof, [publicInputs]);
      if (ver) {
        console.log("Proof verified on-chain!");
      } else {
        console.log("Proof failed on-chain verification");
      }
    } catch (err) {
      console.log("Error verifying your proof");
    } finally {
      noir.value.destroy();
    }
  } else {
    console.log("No proof to verify");
  }
  h.value = "4";
};

onBeforeUnmount(() => {
  if (noir.value && typeof noir.value.destroy === "function") {
    noir.value.destroy();
  }
});
</script>
