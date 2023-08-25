<template>
  <div>
    <Navbar></Navbar>
    <LayoutHeroBanner></LayoutHeroBanner>

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
          <button @click="demoProofStore.computeProof()" class="btn">
            calculateProof
          </button>
          <button @click="demoProofStore.verifyProof()" class="btn">
            verify proof
          </button>

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
import { useNoirInstance } from "/store/noir/noir.index";
const demoProofStore = useDemoProof();
const noirStore = useNoirInstance();

// Initialize noir when the component is mounted
onMounted(async () => {
  noirStore.noir = new NoirBrowser();
  await noirStore.noir.init();
  noirStore.isLoaded = true;
});

onBeforeUnmount(() => {
  if (noir.value && typeof noir.value.destroy === "function") {
    noir.value.destroy();
  }
});
</script>
