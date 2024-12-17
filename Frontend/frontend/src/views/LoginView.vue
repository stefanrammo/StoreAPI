<template>
    <div class="login-form">
        <h2>Login</h2>
        <form @submit.prevent="login">
            <div>
                <label for="email">Email:</label>
                <input type="email" v-model="email" required />
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" v-model="password" required />
            </div>
            <button type="submit">Login</button>
            <p v-if="error" class="error">{{ error }}</p>
        </form>
    </div>
    <p>Don't have an account? <router-link to="/signup">Sign Up</router-link></p>

</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            email: '',
            password: '',
            error: null,
        };
    },
    methods: {
        login() {
            // Clear previous error message
            this.error = null;
            
            axios.post('http://localhost:8080/api/auth/login', {
                email: this.email,
                password: this.password
            })
                .then(response => {
                    // On success, store the token in localStorage
                    console.log('Login successful', response);
                    localStorage.setItem('token', response.data.token);  // Store the token received in response
                    
                    // Redirect to the customers view
                    this.$router.push({ name: 'customers' });
                })
                .catch(error => {
                    // On failure, display error message
                    console.log('Login failed:', error);
                    this.error = 'Login failed. Please check your credentials.';
                });
        }
    }
};
</script>

<style scoped>
.error {
    color: red;
    margin-top: 10px;
}
</style>
