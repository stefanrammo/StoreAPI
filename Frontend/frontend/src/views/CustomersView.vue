<template>
    <main class="customers">
      <h2>Customers</h2>
  
      <!-- Error Message -->
      <p v-if="error" class="error">{{ error }}</p>
  
      <!-- Customers Table -->
      <table v-if="customers.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in customers" :key="customer.id">
            <td>{{ customer.id }}</td>
            <td>{{ customer.name }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ customer.age }}</td>
            <td>
              <button @click="editCustomer(customer)">Edit</button>
              <button @click="deleteCustomer(customer.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Empty State -->
      <p v-else>No customers available.</p>
    </main>
  </template>
  
  <script>
  export default {
    data() {
      return {
        customers: [], // List of customers
        error: null, // Error message
      };
    },
    async created() {
      await this.fetchCustomers(); // Fetch customers when the component is created
    },
    methods: {
      async fetchCustomers() {
        try {
          const token = localStorage.getItem('token'); // Get token from localStorage
          const response = await fetch('http://localhost:8080/customers', {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in Authorization header
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch customers.');
          }
  
          this.customers = await response.json(); // Populate customers list
        } catch (error) {
          this.error = error.message;
        }
      },
  
      async deleteCustomer(customerId) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:8080/customers/${customerId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to delete customer.');
          }
  
          this.customers = this.customers.filter((c) => c.id !== customerId); // Remove from local state
        } catch (error) {
          this.error = error.message;
        }
      },
  
      editCustomer(customer) {
        alert(`Edit functionality for ${customer.name} is not implemented yet.`);
        // Extend this method to show a form for editing customers
      },
    },
  };
  </script>
  
  <style scoped>
  .error {
    color: red;
    margin: 1rem 0;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 0.5rem;
    border: 1px solid #ccc;
    text-align: left;
  }
  
  button {
    margin-right: 0.5rem;
  }
  </style>
  