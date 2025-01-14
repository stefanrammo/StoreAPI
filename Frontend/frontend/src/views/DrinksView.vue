<template>
  <main class="container col-12 col-sm-7">
    <h2 class="text-center">Drinks</h2>

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
            <label for="name">Name:</label>
            <input type="text" v-model="newDrink.name" required />
          </div>
          <div class="mb-1">
            <label for="price">Price:</label>
            <input type="number" v-model="newDrink.price" required />
          </div>
          <div class="mb-1">
            <label for="description">Description:</label>
            <input type="text" v-model="newDrink.description" />
          </div>
          <div class="mb-1">
            <label for="expiration_date">Exp. Date:</label>
            <input type="date" v-model="newDrink.expiration_date" />
          </div>
          <div class="d-flex justify-content-end">
            <button class="btn btn-info btn-sm me-1" type="button" @click="showAddForm = false">Cancel</button>
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
            <label for="editName">Name:</label>
            <input type="text" v-model="editingDrink.name" required />
          </div>
          <div class="mb-1">
            <label for="editPrice">Price:</label>
            <input type="number" v-model="editingDrink.price" required />
          </div>
          <div class="mb-1">
            <label for="editDescription">Description:</label>
            <input type="text" v-model="editingDrink.description" />
          </div>
          <div class="mb-1">
            <label for="editExpiration">Exp. Date:</label>
            <input type="date" v-model="editingDrink.expiration_date" />
          </div>
          <div class="d-flex justify-content-end">
            <button class="btn btn-info btn-sm me-1" type="button" @click="cancelEdit">Cancel</button>
            <button class="btn btn-primary btn-sm" type="submit">Save Changes</button>
          </div>
        </div>
      </form>
    </div>

    <!-- Drinks Table -->
    <DrinksTable
      :items="sortedDrinks"
      :isAdmin="isAdmin"
      @delete-item="deleteItem"
      @edit-item="editItem"
      @add-to-order="addToOrder"
    />

    <!-- Order Summary -->
    <div v-if="order.length" class="order-summary mt-4">
      <h3>Your Order</h3>
      <ul>
        <li v-for="drink in order" :key="drink.id">
          {{ drink.name }} - ${{ drink.price.toFixed(2) }}
        </li>
      </ul>
      <p>Total: ${{ calculateOrderTotal().toFixed(2) }}</p>
      <button class="btn btn-success btn-sm" @click="finalizeOrder">Confirm Order</button>
      <button class="btn btn-danger btn-sm ms-2" @click="clearOrder">Cancel Order</button>
    </div>
  </main>
</template>

<script>
import DrinksTable from "../components/DrinksTable.vue";
import jwt_decode from "jwt-decode";

export default {
  components: { DrinksTable },
  data() {
    return {
      allDrinks: [],
      sortOption: "name:asc",
      editingDrink: null,
      showAddForm: false,
      newDrink: {
        name: "",
        price: "",
        description: "",
        expiration_date: "",
      },
      order: [],
      isAdmin: false,
    };
  },
  computed: {
    sortColumn() {
      return this.sortOption.split(":")[0];
    },
    sortOrder() {
      return this.sortOption.split(":")[1];
    },
    sortedDrinks() {
      return [...this.allDrinks].sort((a, b) => {
        let result = 0;
        if (this.sortColumn === "price") {
          result = a[this.sortColumn] - b[this.sortColumn];
        } else {
          result = a[this.sortColumn]?.localeCompare(b[this.sortColumn] || "");
        }
        return this.sortOrder === "asc" ? result : -result;
      });
    },
  },
  async created() {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwt_decode(token);
        this.isAdmin = decoded?.role === "admin";
      }

      const response = await fetch("http://localhost:8080/drinks");
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      this.allDrinks = await response.json();
    } catch (error) {
      console.error("Error fetching drinks:", error.message);
    }
  },
  methods: {
    cancelEdit() {
      this.editingDrink = null;
    },
    async addToOrder(drink) {
      if (!this.order.find((d) => d.id === drink.id)) {
        this.order.push(drink);
      }
    },
    clearOrder() {
      this.order = [];
    },
    calculateOrderTotal() {
      return this.order.reduce((total, drink) => total + drink.price, 0);
    },
    async finalizeOrder() {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwt_decode(token);

        const orderPayload = {
          customer_id: decoded.id,
          order_date: new Date().toISOString(),
          drink_ids: this.order.map((drink) => drink.id),
        };

        const response = await fetch("http://localhost:8080/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderPayload),
        });

        if (!response.ok) throw new Error("Failed to create order");

        alert("Order successfully created!");
        this.clearOrder();
      } catch (error) {
        console.error("Error finalizing order:", error.message);
      }
    },
    async deleteItem(drinkId) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/drinks/${drinkId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to delete drink");

        this.allDrinks = this.allDrinks.filter((drink) => drink.id !== drinkId);
      } catch (error) {
        console.error("Error deleting drink:", error.message);
      }
    },
    editItem(drink) {
      this.editingDrink = { ...drink };
    },
    async updateItem() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8080/drinks/${this.editingDrink.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(this.editingDrink),
          }
        );

        if (!response.ok) throw new Error("Failed to update drink");

        const updatedDrink = await response.json();
        const index = this.allDrinks.findIndex(
          (drink) => drink.id === updatedDrink.id
        );
        if (index !== -1) {
          this.allDrinks.splice(index, 1, updatedDrink);
        }
        this.editingDrink = null;
      } catch (error) {
        console.error("Error updating drink:", error.message);
      }
    },
    async addItem() {
      try {
        const token = localStorage.getItem("token");
        const drinkPayload = {
          name: this.newDrink.name.trim(),
          price: Number(this.newDrink.price),
          description: this.newDrink.description.trim(),
          expiration_date: this.newDrink.expiration_date || null,
        };

        const response = await fetch("http://localhost:8080/drinks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(drinkPayload),
        });

        if (!response.ok) throw new Error("Failed to add drink");

        const createdDrink = await response.json();
        this.allDrinks.push(createdDrink);
        this.showAddForm = false;
        this.newDrink = { name: "", price: "", description: "", expiration_date: "" };
      } catch (error) {
        console.error("Error adding drink:", error.message);
      }
    },
  },
};
</script>

<style scoped>
.order-summary {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 5px;
}
</style>
