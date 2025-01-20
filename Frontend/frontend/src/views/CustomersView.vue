<template>
  <main class="container col-12 col-sm-9">
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
          <td class="d-flex justify-content-center">
            <button @click="editCustomer(customer)" class="btn btn-primary btn-sm me-2">Edit</button>
            <button @click="deleteCustomer(customer.id)" class="btn btn-danger btn-sm">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Empty State -->
    <p v-else>No customers available.</p>

    <!-- Edit Customer Form -->
    <div v-if="editingCustomer" class="edit-form mt-4">
      <h3>Edit Customer</h3>
      <form @submit.prevent="updateCustomer">
        <div class="form-group mb-2">
          <label for="name">Name:</label>
          <input id="name" v-model="editingCustomer.name" class="form-control" type="text" required />
        </div>
        <div class="form-group mb-2">
          <label for="email">Email:</label>
          <input id="email" v-model="editingCustomer.email" class="form-control" type="email" required />
        </div>
        <div class="form-group mb-2">
          <label for="age">Age:</label>
          <input id="age" v-model="editingCustomer.age" class="form-control" type="number" min="1" required />
        </div>
        <div class="d-flex justify-content-end">
          <button @click="cancelEdit" type="button" class="btn btn-secondary me-2">Cancel</button>
          <button type="submit" class="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
import jwt_decode from "jwt-decode";

export default {
  data() {
    return {
      customers: [], // List of customers
      error: null, // Error message
      isAdmin: false, // Check if the user is an admin
      editingCustomer: null, // Customer being edited
    };
  },
  async created() {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      this.isAdmin = decoded.role === "admin"; // Check user role
      await this.fetchCustomers(decoded.id); // Fetch customers
    } else {
      this.error = "You are not authorized to view this page.";
    }
  },
  methods: {
    async fetchCustomers(userId) {
      try {
        const token = localStorage.getItem("token");
        const endpoint = this.isAdmin
          ? "http://localhost:8080/customers" // Admin sees all customers
          : `http://localhost:8080/customers/${userId}`; // Non-admin sees only their account
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch customers.");
        }

        const data = await response.json();
        this.customers = this.isAdmin ? data : [data]; // Admin gets all, non-admin gets one
      } catch (error) {
        this.error = error.message;
      }
    },

    async deleteCustomer(customerId) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/customers/${customerId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete customer.");
        }

        // Log out if the current user deletes their own account
        if (!this.isAdmin) {
          localStorage.removeItem("token");
          alert("Your account has been deleted. You will now be logged out.");
          this.$router.push("/login");
        } else {
          this.customers = this.customers.filter((c) => c.id !== customerId); // Remove from local state
        }
      } catch (error) {
        this.error = error.message;
      }
    },

    editCustomer(customer) {
      this.editingCustomer = { ...customer }; // Open edit form with selected customer
    },

    cancelEdit() {
      this.editingCustomer = null; // Close edit form
    },

    async updateCustomer() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8080/customers/${this.editingCustomer.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(this.editingCustomer),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update customer.");
        }

        const updatedCustomer = await response.json();
        const index = this.customers.findIndex((c) => c.id === updatedCustomer.id);
        if (index !== -1) {
          this.customers.splice(index, 1, updatedCustomer);
        }

        this.editingCustomer = null; // Close edit form
      } catch (error) {
        this.error = error.message;
      }
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

th,
td {
  padding: 0.5rem;
  border: 1px solid #ccc;
  text-align: left;
}

button {
  margin-right: 0.5rem;
}

.edit-form {
  padding: 1rem;
  border-radius: 5px;
}
</style>
