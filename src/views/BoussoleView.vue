<template>
  <main>
    <SolidLogin />
    <BrainLoader />
    <PodBrowser />
    <CommandInput />
    <BoussoleComponent />
  </main>
</template>

<script setup>
import BoussoleComponent from '../components/BoussoleComponent.vue';
</script>

<script>
// Import des nouveaux composants
import SolidLogin from '../components/SolidLogin.vue';
import CommandInput from '../components/CommandInput.vue';
import BrainLoader from '../components/BrainLoader.vue';
import NodeEdition from '../components/NodeEdition.vue';
import PodBrowser from '../components/PodBrowser.vue';

export default {
  components: {
    SolidLogin,
    CommandInput,
    BrainLoader,
    NodeEdition,
    PodBrowser
  }
}
</script>

<!-- <style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style> -->
