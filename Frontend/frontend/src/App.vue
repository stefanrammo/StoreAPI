<template>
  <div>
    <Navbar />  <!-- Include the Navbar -->
    <router-view /> <!-- This is where the routed components will be displayed -->
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  components: {
    Navbar,
  },
};
</script>
