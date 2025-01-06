<template>
    <main>
      <DrinksTable :items="allDrinks" @delete-item="deleteItem" @edit-item="editItem" />
  
      <!-- Add Drink Button -->
      <button v-if="!showAddForm" @click="showAddForm = true" class="btn btn-primary btn-sm">Add Drink</button>
  
      <!-- Add Drink Form: Only show if showAddForm is true -->
      <div v-if="showAddForm" class="edit-form">
        <h2>Add New Drink</h2>
        <form @submit.prevent="addItem">
          <div class="row col-6">
            <div class="mb-1">
              <label class="col-4" for="name">Name:</label>
              <input class="col-8" type="text" v-model="newDrink.name" required />
            </div>
            <div class="mb-1">
              <label class="col-4" for="price">Price:</label>
              <input class="col-8" type="number" v-model="newDrink.price" required />
            </div>
            <div class="mb-1">
              <label class="col-4" for="description">Description:</label>
              <input class="col-8" type="text" v-model="newDrink.description" />
            </div>
            <div class="mb-1">
              <label class="col-4" for="order_id">Order ID:</label>
              <input class="col-8" type="number" v-model="newDrink.order_id" />
            </div>
            <div class="mb-1">
              <label class="col-4" for="expiration_date">Exp. Date:</label>
              <input class="col-8" type="date" v-model="newDrink.expiration_date" />
            </div>
            <div class="d-flex justify-content-end">
              <div class="mb-1 justify-content-end">
                <button class="me-1 btn btn-info btn-sm" type="button" @click="showAddForm = false">Cancel</button>
                <button class="btn btn-primary btn-sm" type="submit">Add Drink</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  </template>
  
  <script>
  import DrinksTable from '../components/DrinksTable.vue';
  export default {
    components: { DrinksTable },
    data() {
      return {
        allDrinks: [],
        editingDrink: null,
        showAddForm: false,  // State to toggle the "Add Drink" form
        newDrink: {
          name: '',
          price: '',
          description: '',
          order_id: null, // Add order_id here
          expiration_date: null, // Add expiration_date here
        }, // For new drink data
      };
    },
    async created() {
      const response = await fetch('http://localhost:8080/drinks');
      const data = await response.json();
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
  
      // Edit the drink
      editItem(drink) {
        this.editingDrink = { ...drink }; // Make a copy of the drink for editing
      },
  
      // Update the drink
      async updateItem() {
        try {
          const response = await fetch(`http://localhost:8080/drinks/${this.editingDrink.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.editingDrink),
          });
  
          if (response.ok) {
            const updatedDrink = await response.json();
            const index = this.allDrinks.findIndex(drink => drink.id === updatedDrink.id);
            if (index !== -1) {
              this.allDrinks.splice(index, 1, updatedDrink); // Replace the old drink with the updated one
            }
            this.editingDrink = null; // Clear the editing form
          } else {
            console.error('Failed to update drink');
          }
        } catch (error) {
          console.error('Error updating drink:', error);
        }
      },
  
  
      async addItem() {
        console.log("Adding a new drink:", this.newDrink); // Log the reactive object
        try {
          // Create a plain object for the POST request
          const drinkPayload = {
            name: this.newDrink.name.trim(), // Trim whitespace from strings
            price: Number(this.newDrink.price), // Ensure price is a number
            description: this.newDrink.description.trim(),
            order_id: this.newDrink.order_id || null,
            expiration_date: this.newDrink.expiration_date || null,
          };
  
          console.log("Payload sent to the backend:", drinkPayload); // Log plain object
  
          const response = await fetch('http://localhost:8080/drinks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(drinkPayload), // Send the plain object
          });
  
          if (response.ok) {
            const createdDrink = await response.json();
            console.log("Created drink:", createdDrink); // Log the created drink
            this.newDrink.id = createdDrink.id;
            this.allDrinks.push({ ...this.newDrink });
            this.showAddForm = false;
            this.newDrink = { name: '', price: '', description: '', order_id: null, expiration_date: null }; // Reset form
          } else {
            const errorText = await response.text();
            console.error('Failed to add drink:', response.status, errorText);
          }
        } catch (error) {
          console.error('Error adding drink:', error);
        }
      }
    }
  };
  </script>
  