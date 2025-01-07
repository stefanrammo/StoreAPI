<template>
  <main class="container col-12 col-sm-7">
    <!-- Sorting Options -->
    <div class="sorting-options mb-3">
      <label for="sortColumn" class="form-label">Sort By:</label>
      <select id="sortColumn" v-model="sortOption" class="form-select form-select-sm">
        <option value="name:asc">Name (A-Z)</option>
        <option value="name:desc">Name (Z-A)</option>
        <option value="price:asc">Price (Ascending)</option>
        <option value="price:desc">Price (Descending)</option>
        <option value="expiration_date:asc">Expiration Date (Ascending)</option>
        <option value="expiration_date:desc">Expiration Date (Descending)</option>
      </select>
    </div>

    <DrinksTable :items="sortedDrinks" @delete-item="deleteItem" @edit-item="editItem" />

    <!-- Add Drink Button -->
    <button v-if="!showAddForm" @click="showAddForm = true" class="btn btn-primary btn-sm">Add Drink</button>

    <!-- Add Drink Form: Only show if showAddForm is true -->
    <div v-if="showAddForm" class="edit-form container">
      <h2>Add New Drink</h2>
      <form @submit.prevent="addItem">
        <div class="row col-9 col-sm-6">
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
      sortOption: 'name:asc',
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
  computed: {
  // Extract the column part from the sortOption
  sortColumn() {
    return this.sortOption.split(':')[0];
  },
  // Extract the order part from the sortOption
  sortOrder() {
    return this.sortOption.split(':')[1];
  },
  // Sort the drinks based on the selected column and order
  sortedDrinks() {
    return [...this.allDrinks].sort((a, b) => {
      let result = 0;
      if (this.sortColumn === 'price') {
        result = a[this.sortColumn] - b[this.sortColumn];
      } else {
        result = a[this.sortColumn]?.localeCompare(b[this.sortColumn] || '');
      }
      return this.sortOrder === 'asc' ? result : -result;
    });
  },
},
  async created() {
    const response = await fetch('http://localhost:8080/drinks');
    const data = await response.json();
    this.allDrinks = data;
  },
  methods: {
    async deleteItem(drinkId) {
      try {
        const response = await fetch(`http://localhost:8080/drinks/${drinkId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          this.allDrinks = this.allDrinks.filter(drink => drink.id !== drinkId);
        } else {
          console.error('Failed to delete drink');
        }
      } catch (error) {
        console.error('Error deleting drink:', error);
      }
    },

    editItem(drink) {
      this.editingDrink = { ...drink };
    },

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
            this.allDrinks.splice(index, 1, updatedDrink);
          }
          this.editingDrink = null;
        } else {
          console.error('Failed to update drink');
        }
      } catch (error) {
        console.error('Error updating drink:', error);
      }
    },

    async addItem() {
      try {
        const drinkPayload = {
          name: this.newDrink.name.trim(),
          price: Number(this.newDrink.price),
          description: this.newDrink.description.trim(),
          order_id: this.newDrink.order_id || null,
          expiration_date: this.newDrink.expiration_date || null,
        };

        const response = await fetch('http://localhost:8080/drinks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(drinkPayload),
        });

        if (response.ok) {
          const createdDrink = await response.json();
          this.newDrink.id = createdDrink.id;
          this.allDrinks.push({ ...this.newDrink });
          this.showAddForm = false;
          this.newDrink = { name: '', price: '', description: '', order_id: null, expiration_date: null };
        } else {
          const errorText = await response.text();
          console.error('Failed to add drink:', response.status, errorText);
        }
      } catch (error) {
        console.error('Error adding drink:', error);
      }
    },
  },
};
</script>
