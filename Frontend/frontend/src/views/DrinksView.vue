<template>
  <main class="container col-12 col-sm-7">
    <!-- Sorting Options -->
    <div class="row d-flex align-items-center mb-2">
      <div class="col-auto">
        <button v-if="!showAddForm && !editingDrink && isAdmin" @click="showAddForm = true" class="btn btn-primary btn-sm">Add Drink</button>
      </div>
      <div class="col-auto ms-auto">
        <div class="sorting-options">
          <label for="sortColumn" class="form-label me-2">Sort By:</label>
          <select id="sortColumn" v-model="sortOption" class="form-select form-select-sm d-inline-block w-auto">
            <option value="name:asc">Name (A-Z)</option>
            <option value="name:desc">Name (Z-A)</option>
            <option value="price:asc">Price (Ascending)</option>
            <option value="price:desc">Price (Descending)</option>
            <option value="expiration_date:asc">Expiration Date (Ascending)</option>
            <option value="expiration_date:desc">Expiration Date (Descending)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Add Drink Form -->
    <div v-if="showAddForm && isAdmin" class="edit-form container">
      <h2>Add New Drink</h2>
      <form @submit.prevent="addItem">
        <div class="row col-12 col-sm-6 mb-2">
          <div class="mb-1">
            <label class="col-8" for="name">Name:</label>
            <input class="col-12" type="text" v-model="newDrink.name" required />
          </div>
          <div class="mb-1">
            <label class="col-8" for="price">Price:</label>
            <input class="col-12" type="number" v-model="newDrink.price" required />
          </div>
          <div class="mb-1">
            <label class="col-8" for="description">Description:</label>
            <input class="col-12" type="text" v-model="newDrink.description" />
          </div>
          <div class="mb-1">
            <label class="col-8" for="order_id">Order ID:</label>
            <input class="col-12" type="number" v-model="newDrink.order_id" />
          </div>
          <div class="mb-1">
            <label class="col-8" for="expiration_date">Exp. Date:</label>
            <input class="col-12" type="date" v-model="newDrink.expiration_date" />
          </div>
          <div class="d-flex justify-content-end">
            <button class="me-1 btn btn-info btn-sm" type="button" @click="showAddForm = false">Cancel</button>
            <button class="btn btn-primary btn-sm" type="submit">Add Drink</button>
          </div>
        </div>
      </form>
    </div>

    <!-- Edit Drink Form -->
    <div v-if="editingDrink && isAdmin" class="edit-form container">
      <h2>Edit Drink</h2>
      <form @submit.prevent="updateItem">
        <div class="row col-12 col-sm-6 mb-2">
          <div class="mb-1">
            <label class="col-8" for="editName">Name:</label>
            <input class="col-12" id="editName" type="text" v-model="editingDrink.name" required />
          </div>
          <div class="mb-1">
            <label class="col-8" for="editPrice">Price:</label>
            <input class="col-12" id="editPrice" type="number" v-model="editingDrink.price" required />
          </div>
          <div class="mb-1">
            <label class="col-8" for="editDescription">Description:</label>
            <input class="col-12" id="editDescription" type="text" v-model="editingDrink.description" />
          </div>
          <div class="mb-1">
            <label class="col-8" for="editExpiration">Exp. Date:</label>
            <input class="col-12" id="editExpiration" type="date" v-model="editingDrink.expiration_date" />
          </div>
          <div class="d-flex justify-content-end">
            <button class="me-1 btn btn-info btn-sm" type="button" @click="cancelEdit">Cancel</button>
            <button class="btn btn-primary btn-sm" type="submit">Save Changes</button>
          </div>
        </div>
      </form>
    </div>

    <!-- Drinks Table -->
    <DrinksTable :items="sortedDrinks" :isAdmin="isAdmin" @delete-item="deleteItem" @edit-item="editItem" />
  </main>
</template>

<script>
import DrinksTable from '../components/DrinksTable.vue';
import jwt_decode from 'jwt-decode';

export default {
  components: { DrinksTable },
  data() {
    return {
      allDrinks: [],
      sortOption: 'name:asc',
      editingDrink: null,
      showAddForm: false,
      newDrink: {
        name: '',
        price: '',
        description: '',
        order_id: null,
        expiration_date: null,
      },
      isAdmin: false,
    };
  },
  computed: {
    sortColumn() {
      return this.sortOption.split(':')[0];
    },
    sortOrder() {
      return this.sortOption.split(':')[1];
    },
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
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt_decode(token);
      this.isAdmin = decoded?.role === 'admin';
    }

    const response = await fetch('http://localhost:8080/drinks');
    const data = await response.json();
    this.allDrinks = data;
  },
  methods: {
    cancelEdit() {
      this.editingDrink = null;
    },
    async deleteItem(drinkId) {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:8080/drinks/${drinkId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
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
        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:8080/drinks/${this.editingDrink.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
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
        const token = localStorage.getItem('token');

        const drinkPayload = {
          name: this.newDrink.name.trim(),
          price: Number(this.newDrink.price),
          description: this.newDrink.description.trim(),
          order_id: this.newDrink.order_id || null,
          expiration_date: this.newDrink.expiration_date || null,
        };

        const response = await fetch('http://localhost:8080/drinks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
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
