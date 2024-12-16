<script>
import DrinksTable from '../components/DrinksTable.vue'
export default {
  components: { DrinksTable },
  data() { return {
    allDrinks: []
  }},
  async created() {
  const response = await fetch('http://localhost:8080/drinks');
  const data = await response.json();
  console.log(data);  // Log the fetched data to verify it's being returned correctly
  this.allDrinks = data;
  }
}
</script>

<template>
  <main>
    <DrinksTable :items="allDrinks
    
    " />
  </main>
</template>
