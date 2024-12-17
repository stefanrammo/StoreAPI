<template>
    <div class="signup-form">
        <h2>Sign Up</h2>
        <form @submit.prevent="signup">
            <div>
                <label for="name">Name:</label>
                <input type="text" v-model="name" required />
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" v-model="email" required />
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" v-model="password" required />
            </div>
            <div>
                <label for="age">Age:</label>
                <input type="number" v-model="age" required />
            </div>
            <button type="submit">Sign Up</button>
            <p v-if="error" class="error">{{ error }}</p>
        </form>
    </div>
    <p>Already have an account? <router-link to="/login">Login</router-link></p>

</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            name: '',
            email: '',
            password: '',
            age: '',
            error: null,
        };
    },
    methods: {
        signup() {
            // Clear previous error message
            this.error = null;
            
            axios.post('http://localhost:8080/api/auth/signup', {
                name: this.name,
                email: this.email,
                password: this.password,
                age: this.age
            })
                .then(response => {
                    // On success, you can redirect to the login page or customers view
                    console.log('User created successfully', response);
                    this.$router.push({ name: 'login' }); // Redirect to login page after successful signup
                })
                .catch(error => {
                    // On failure, display error message
                    console.log('Signup failed:', error);
                    this.error = 'Signup failed. Please try again.';
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
