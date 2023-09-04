<template>
  <div>
    <Navbar></Navbar>
    <LayoutHeroBanner></LayoutHeroBanner>
    <div class="flex justify-center items-center">
      <div
        class="w-full max-w-2xl flex flex-row space-x-6 p-10 card rounded-box"
      >
        <!-- Input section -->
        <div class="flex flex-col space-y-4 w-1/2">
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
          <button @click="computeProof" class="btn">Compute Proof</button>
        </div>

        <!-- Proof section -->
        <div
          id="proofs-section"
          class="w-1/2 flex flex-col space-y-4 bg-center bg-cover"
        >
          <div
            v-if="demoProofStore.proof"
            class="card w-full glass backdrop-blur-md"
          >
            <div class="card-body">
              <h2 class="card-title">Proof Computed</h2>
              <p>
                Proof Generated in {{ demoProofStore.proof.computationTime }} ms
              </p>
              <p>Public input: {{ demoProofStore.proof.parameters.y }}</p>
              <p>Private input: {{ demoProofStore.proof.parameters.x }}</p>
              <div class="card-actions justify-end">
                <button @click="verifyProof" class="btn btn-primary">
                  Verify
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <NuxtSnackbar />
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
// const toast = useToast();
// Initialize noir when the component is mounted
const snackbar = useSnackbar();

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

const computeProof = async function () {
  const result = await demoProofStore
    .computeProof()
    .then((res) => {})
    .catch((err) => {
      console.log("err", err);
      snackbar.add({
        type: "error",
        text: err,
      });
    });
};

const verifyProof = async function () {
  try {
    await demoProofStore.verifyProof();
    snackbar.add({
      type: "success",
      text: "Your proof was successfully verified on-chain !",
    });
  } catch (err) {
    snackbar.add({
      type: "error",
      text: err,
    });
  }
};
</script>
