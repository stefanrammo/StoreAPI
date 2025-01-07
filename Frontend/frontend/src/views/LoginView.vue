<template>
    <div class="container col-12 col-sm-3">
        <div class="card p-2">
            <h2 class="card-header text-center">Login</h2>
            <form @submit.prevent="login" class="card-body">
                <div>
                    <input type="email" v-model="email" class="w-100 mb-1" placeholder="Email" required />
                </div>
                <div>
                    <input type="password" v-model="password" class="w-100 mb-1" placeholder="Password" required />
                </div>
                <button type="submit" class="w-100 btn btn-primary">Login</button>
                <p v-if="error" class="error">{{ error }}</p>
            </form>
            <p class="ps-1 pe-1 text-center">Don't have an account? <router-link to="/signup">Sign Up</router-link></p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import jwt_decode from 'jwt-decode'; // Correct import

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
                    const token = response.data.token;
                    localStorage.setItem('token', token);  // Store the token received in response
                    
                    // Decode token to get user info
                    const decodedToken = jwt_decode(token);
                    console.log(decodedToken);  // Check the decoded token

                    // Optionally, store user role or id in localStorage if needed
                    localStorage.setItem('role', decodedToken.role);
                    localStorage.setItem('userId', decodedToken.id);
                    
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
