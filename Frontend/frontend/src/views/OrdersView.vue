<template>
    <main class="container mt-4">
      <h2 class="text-center">Orders</h2>
  
      <!-- Orders Table -->
      <div v-if="orders.length" class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-dark text-center">
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th v-if="isAdmin">Customer</th>
              <th>Drinks</th>
              <th>Total Price</th>
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
                <ul>
                  <li v-for="drink in order.drinks" :key="drink.id">
                    {{ drink.name }} - ${{ drink.price.toFixed(2) }}
                  </li>
                </ul>
              </td>
              <td class="text-center">
                ${{ calculateTotalPrice(order.drinks).toFixed(2) }}
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
  
  export default {
    name: "OrdersView",
    data() {
      return {
        orders: [],
        isAdmin: false,
        userId: null, // To store the logged-in user's ID
      };
    },
    async created() {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwt_decode(token);
        this.isAdmin = decoded.role === "admin"; // Check if the user is an admin
        this.userId = decoded.id; // Store the logged-in user's ID
        await this.fetchOrders();
      } else {
        console.error("Unauthorized access.");
      }
    },
    methods: {
      async fetchOrders() {
        try {
          const token = localStorage.getItem("token");
          const endpoint = this.isAdmin
            ? "http://localhost:8080/api/orders" // Admin fetches all orders
            : `http://localhost:8080/api/orders?customer_id=${this.userId}`; // Customer fetches their own orders
          const response = await fetch(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            this.orders = data;
          } else {
            console.error("Failed to fetch orders.");
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      },
      formatDate(date) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(date).toLocaleDateString(undefined, options);
      },
      calculateTotalPrice(drinks) {
        return drinks.reduce((total, drink) => total + drink.price, 0);
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 900px;
  }
  .table-responsive {
    overflow-x: auto;
  }
  </style>
  