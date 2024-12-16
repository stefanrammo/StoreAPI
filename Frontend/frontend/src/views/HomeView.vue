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
  },
  methods: {
    // Delete the drink by ID
    async deleteItem(drinkId) {
      try {
        const response = await fetch(`http://localhost:8080/drinks/${drinkId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // Remove the drink from the list in the frontend
          this.allDrinks = this.allDrinks.filter(drink => drink.id !== drinkId);
        } else {
          console.error('Failed to delete drink');
        }
      } catch (error) {
        console.error('Error deleting drink:', error);
      }
    }
  }
}
</script>

<template>
  <main>
    <DrinksTable :items="allDrinks"  @delete-item="deleteItem" />
  </main>
</template>
