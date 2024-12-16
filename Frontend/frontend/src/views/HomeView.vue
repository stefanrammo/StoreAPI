<script>
import DrinksTable from '../components/DrinksTable.vue'
export default {
  components: { DrinksTable },
  data() {
    return {
      allDrinks: [],
      editingDrink: null,  // This will store the drink being edited
    }
  },
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
    },

    // Method to set the drink being edited
    editItem(drink) {
      this.editingDrink = { ...drink };  // Make a copy of the drink for editing
    },

    // Method to handle the update of the drink
    async updateItem() {
      try {
        const response = await fetch(`http://localhost:8080/drinks/${this.editingDrink.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.editingDrink),
        });

        if (response.ok) {
          const updatedDrink = await response.json();
          // Update the drink in the list
          const index = this.allDrinks.findIndex(drink => drink.id === updatedDrink.id);
          if (index !== -1) {
            this.allDrinks.splice(index, 1, updatedDrink); // Replace the old drink with the updated one
          }
          this.editingDrink = null;  // Clear the editing form
        } else {
          console.error('Failed to update drink');
        }
      } catch (error) {
        console.error('Error updating drink:', error);
      }
    }
  }
}
</script>
<template>
  <main>
    <DrinksTable :items="allDrinks" @delete-item="deleteItem" @edit-item="editItem" />

    <!-- Edit form: only show if editingDrink is not null -->
    <div v-if="editingDrink" class="edit-form">
      <h2>Edit Drink</h2>
      <form @submit.prevent="updateItem">
        <div>
          <label for="name">Name:</label>
          <input type="text" v-model="editingDrink.name" required />
        </div>
        <div>
          <label for="price">Price:</label>
          <input type="number" v-model="editingDrink.price" required />
        </div>
        <div>
          <label for="description">Description:</label>
          <input type="text" v-model="editingDrink.description" />
        </div>
        <div>
          <label for="expiration_date">Expiration Date:</label>
          <input type="date" v-model="editingDrink.expiration_date" />
        </div>
        <button type="submit">Save Changes</button>
        <button type="button" @click="editingDrink = null">Cancel</button>
      </form>
    </div>
  </main>
</template>
