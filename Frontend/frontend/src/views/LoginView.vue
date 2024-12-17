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
        // Inside your Vue component's method
        login() {
            axios.post('http://localhost:8080/api/auth/login', {
                email: this.email,
                password: this.password
            })
                .then(response => {
                    console.log('Login successful', response);
                })
                .catch(error => {
                    console.log('Login failed:', error);
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