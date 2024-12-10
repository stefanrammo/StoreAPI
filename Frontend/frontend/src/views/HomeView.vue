<script>
import DrinksTable from '../components/DrinksTable.vue'
export default {
  components: { DrinksTable },
  data() { return {
    allDrinks: []
  }},
  async Created() {
    this.allDrinks = await (await fetch('https://localhost:8080/drinks')).json();
  }
}
</script>

<template>
  <main>
    <DrinksTable :items="allDrinks
    
    " />
  </main>
</template>
