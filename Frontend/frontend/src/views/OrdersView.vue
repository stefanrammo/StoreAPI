<template>
    <main class="container mt-4">
      <h2 class="text-center">My Orders</h2>
  
      <!-- Orders Table -->
      <div v-if="orders.length" class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-dark text-center">
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Drinks</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.order_id">
              <td class="text-center">{{ order.order_id }}</td>
              <td class="text-center">{{ formatDate(order.order_date) }}</td>
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
        <p class="text-center mt-4">You have no orders yet.</p>
      </div>
    </main>
  </template>
  
  <script>
  export default {
    name: "OrdersView",
    data() {
      return {
        orders: [],
      };
    },
    methods: {
      async fetchOrders() {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch("http://localhost:8080/api/orders", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            this.orders = data;
          } else {
            console.error("Failed to fetch orders");
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
    async created() {
      await this.fetchOrders();
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
  