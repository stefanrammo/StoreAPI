<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/drinks">Drinks</router-link></li>
        <li><router-link to="/customers">Customers</router-link></li>
        <li><router-link to="/about">About</router-link></li>
  
        <!-- Conditionally show logout if the user is logged in -->
        <li v-if="isAuthenticated">
          <button @click="logout">Logout</button>
        </li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isAuthenticated: !!localStorage.getItem('token'),  // Set initial state based on localStorage
      };
    },
    methods: {
      logout() {
        // Remove the token from localStorage to log the user out
        localStorage.removeItem('token');
        
        // Update the authentication state
        this.isAuthenticated = false;
        
        // Redirect to the login page
        this.$router.push({ name: 'login' });
      }
    },
    watch: {
      // Watch for changes to localStorage and update the authentication state
      // eslint-disable-next-line no-unused-vars
      '$route'(to, from) {
        this.isAuthenticated = !!localStorage.getItem('token');
      }
    }
  };
  </script>
  
  <style scoped>
  nav {
    background-color: #333;
    color: white;
    padding: 1em;
  }
  
  ul {
    display: flex;
    list-style-type: none;
    padding: 0;
  }
  
  li {
    margin: 0 1em;
  }
  
  button {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 0.5em 1em;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #c0392b;
  }
  </style>
  