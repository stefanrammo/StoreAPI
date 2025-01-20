<template>
  <main class="container mt-4">
    <!-- Notification -->
    <div v-if="notification.message" :class="['notification', notification.type]">
      {{ notification.message }}
    </div>

    <h2 class="text-center">Orders</h2>

    <!-- Orders Table -->
    <div v-if="orders.length" class="table-responsive">
      <table class="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th v-if="isAdmin">Customer</th>
            <th>Drinks</th>
            <th>Total Price</th>
            <th v-if="isAdmin || isCustomer" class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.order_id">
            <td class="text-center">{{ order.order_id }}</td>
            <td class="text-center">{{ formatDate(order.order_date) }}</td>
            <td v-if="isAdmin" class="text-center">
              {{ order.customer?.name }} ({{ order.customer?.email }})
            </td>
            <td>
              <ul class="drink-list">
                <li v-for="drink in order.drinks" :key="drink.id">
                  {{ drink.name }} - ${{ drink.price.toFixed(2) }}
                </li>
              </ul>
            </td>
            <td class="text-center">
              ${{ calculateTotalPrice(order.drinks).toFixed(2) }}
            </td>
            <td v-if="isAdmin || (isCustomer && order.customer_id === userId)" class="text-center">
              <button
                class="btn btn-edit"
                @click="editOrder(order)"
                :disabled="!canEdit(order)"
              >
                Edit
              </button>
              <button
                class="btn btn-delete"
                @click="confirmDelete(order.order_id)"
              >
                Delete
              </button>
            </td>
          </tr>

          <!-- Inline Edit Row -->
          <tr v-if="editingOrder">
            <td colspan="6">
              <form @submit.prevent="submitEdit">
                <div class="form-group">
                  <label for="orderDate">Order Date:</label>
                  <input
                    type="date"
                    id="orderDate"
                    v-model="editingOrder.order_date"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="drinks">Drinks:</label>
                  <select
                    id="drinks"
                    multiple
                    v-model="editingOrder.drink_ids"
                    required
                  >
                    <option
                      v-for="drink in allDrinks"
                      :key="drink.id"
                      :value="drink.id"
                    >
                      {{ drink.name }} - ${{ drink.price.toFixed(2) }}
                    </option>
                  </select>
                  <small class="form-text">
                    Hold down the Ctrl (Windows) or Command (Mac) button to select multiple options.
                  </small>
                </div>
                <div class="form-actions">
                  <button type="submit" class="btn btn-primary">Save</button>
                  <button type="button" class="btn btn-secondary" @click="cancelEdit">Cancel</button>
                </div>
              </form>
            </td>
          </tr>

          <!-- Delete Confirmation Row -->
          <tr v-if="showDeleteConfirmation">
            <td colspan="6">
              <p>Are you sure you want to delete order #{{ deleteOrderId }}?</p>
              <button class="btn btn-danger" @click="deleteOrder">Yes, Delete</button>
              <button class="btn btn-secondary" @click="cancelDelete">Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else>
      <p class="text-center mt-4">No orders available.</p>
    </div>
  </main>
</template>

<script>
import jwt_decode from "jwt-decode";
import axios from "axios";

export default {
  name: "OrdersView",
  data() {
    return {
      orders: [],
      isAdmin: false,
      userId: null, // To store the logged-in user's ID
      editingOrder: null, // To store the order being edited
      allDrinks: [], // To populate the drinks selection in the edit form
      deleteOrderId: null, // To store the ID of the order to be deleted
      showDeleteConfirmation: false, // Control visibility of delete confirmation
      notification: {
        message: "",
        type: "", // 'success' or 'error'
      },
    };
  },
  computed: {
    isCustomer() {
      return !this.isAdmin;
    },
  },
  async created() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        this.isAdmin = decoded.role === "admin"; // Check if the user is an admin
        this.userId = decoded.id; // Store the logged-in user's ID
        await this.fetchAllDrinks(); // Fetch all available drinks for the edit form
        await this.fetchOrders();
      } catch (error) {
        console.error("Error decoding token:", error);
        // Optionally, redirect to login page
        this.$router.push("/login");
      }
    } else {
      console.error("Unauthorized access.");
      // Optionally, redirect to login page
      this.$router.push("/login");
    }
  },
  methods: {
    // Helper method to format date for input
    formatDateForInput(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (`0${date.getMonth() + 1}`).slice(-2);
      const day = (`0${date.getDate()}`).slice(-2);
      return `${year}-${month}-${day}`;
    },
    // Fetch all drinks from the backend
    async fetchAllDrinks() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/drinks", { // Use absolute URL
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          this.allDrinks = data;
          console.log("Drinks fetched:", this.allDrinks);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch drinks:", errorData.error || "Unknown error.");
          this.showNotification(errorData.error || "Failed to fetch drinks.", "error");
        }
      } catch (error) {
        console.error("Error fetching drinks:", error);
        this.showNotification("Error fetching drinks.", "error");
      }
    },
    // Fetch all orders from the backend
    async fetchOrders() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found.");
        }

        const endpoint = "http://localhost:8080/api/orders"; // Same endpoint for both Admin and Customer

        const response = await fetch(endpoint, { // Use absolute URL
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          this.orders = data;
          console.log("Orders fetched:", this.orders);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch orders:", errorData.error || "Unknown error.");
          this.showNotification(errorData.error || "Failed to fetch orders.", "error");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        this.showNotification("Error fetching orders.", "error");
      }
    },
    // Format date for display
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    // Calculate total price of drinks in an order
    calculateTotalPrice(drinks) {
      return drinks.reduce((total, drink) => total + drink.price, 0);
    },
    // Determine if the current user can edit the order
    canEdit(order) {
      return this.isAdmin || (this.isCustomer && order.customer_id === this.userId);
    },
    // Initialize editingOrder with the selected order's data
    editOrder(order) {
      if (this.canEdit(order)) {
        this.editingOrder = {
          order_id: order.order_id,
          order_date: this.formatDateForInput(order.order_date),
          drink_ids: order.drinks ? order.drinks.map(drink => drink.id) : [],
        };
      } else {
        this.showNotification("You do not have permission to edit this order.", "error");
      }
    },
    // Cancel editing
    cancelEdit() {
      this.editingOrder = null;
    },
    // Submit the edited order to the backend
    async submitEdit() {
      try {
        const token = localStorage.getItem("token");
        const { order_id, order_date, drink_ids } = this.editingOrder;

        const payload = {
          order_date,   // Already in 'yyyy-MM-dd' format
          drink_ids,    // Array of drink IDs
        };

        const response = await axios.put(
          `http://localhost:8080/api/orders/${order_id}`, // Use absolute URL
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          // Successfully updated
          this.fetchOrders(); // Refresh the orders list
          this.editingOrder = null; // Clear the editing state
          // Show a success notification
          this.showNotification("Order updated successfully.", "success");
        } else {
          console.error("Failed to update order.");
          this.showNotification("Failed to update order.", "error");
        }
      } catch (error) {
        console.error("Error updating order:", error);
        // Attempt to extract error message from backend response
        const errorMessage = error.response?.data?.error || "Error updating order.";
        this.showNotification(errorMessage, "error");
      }
    },
    // Confirm deletion of an order
    confirmDelete(orderId) {
      // Allow deletion if admin or customer owns the order
      const order = this.orders.find(o => o.order_id === orderId);
      if (this.isAdmin || (this.isCustomer && order.customer_id === this.userId)) {
        this.deleteOrderId = orderId;
        this.showDeleteConfirmation = true;
      } else {
        this.showNotification("You do not have permission to delete this order.", "error");
      }
    },
    // Cancel deletion
    cancelDelete() {
      this.deleteOrderId = null;
      this.showDeleteConfirmation = false;
    },
    // Delete the confirmed order
    async deleteOrder() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
          `http://localhost:8080/api/orders/${this.deleteOrderId}`, // Use absolute URL
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 204) {
          // Successfully deleted
          this.fetchOrders(); // Refresh the orders list
          this.deleteOrderId = null;
          this.showDeleteConfirmation = false;
          // Show a success notification
          this.showNotification("Order deleted successfully.", "success");
        } else {
          console.error("Failed to delete order.");
          this.showNotification("Failed to delete order.", "error");
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        // Attempt to extract error message from backend response
        const errorMessage = error.response?.data?.error || "Error deleting order.";
        this.showNotification(errorMessage, "error");
      }
    },
    // Display notifications to the user
    showNotification(message, type) {
      this.notification.message = message;
      this.notification.type = type;
      setTimeout(() => {
        this.notification.message = "";
        this.notification.type = "";
      }, 3000); // Hide after 3 seconds
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
}

.mt-4 {
  margin-top: 1.5rem;
}

.text-center {
  text-align: center;
}

.table-responsive {
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th,
.orders-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.drink-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.drink-list li {
  margin-bottom: 4px;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-edit {
  background-color: #4caf50;
  color: white;
  margin-right: 8px;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  margin-right: 8px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input[type="date"],
.form-group select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.form-text {
  font-size: 0.875em;
  color: #6c757d;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  border-radius: 4px;
  color: white;
  z-index: 1100;
  opacity: 0.9;
}

.notification.success {
  background-color: #4caf50;
}

.notification.error {
  background-color: #f44336;
}
</style>
