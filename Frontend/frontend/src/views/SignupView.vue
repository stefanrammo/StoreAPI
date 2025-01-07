<template>
    <main class="container col-12 col-sm-3">
        <div class="card">
            <h2 class="card-header text-center">Sign Up</h2>
            <form @submit.prevent="signup" class="card-body">
                <div>
                    <input type="text" v-model="name" class="w-100 mb-1" placeholder="Name" required />
                </div>
                <div>
                    <input type="email" v-model="email"  class="w-100 mb-1" placeholder="Email" required />
                </div>
                <div>
                    <input type="password" v-model="password" class="w-100 mb-1" placeholder="Password" required />
                </div>
                <div>
                    <input type="number" v-model="age" class="w-100 mb-1" placeholder="Age" required />
                </div>
                <button type="submit" class="w-100 btn btn-primary">Sign Up</button>
                <p v-if="error" class="error">{{ error }}</p>
            </form>
            <p class="ps-1 pe-1 text-center">Already have an account? <router-link to="/login">Login</router-link></p>
        </div>
    </main>

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
