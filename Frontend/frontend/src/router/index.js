import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

// Import the DrinksView component
import DrinksView from '../views/DrinksView.vue';
import CustomersView from '../views/CustomersView.vue';
import LoginView from '../views/LoginView.vue';
import Signup from '../views/SignupView.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/drinks', // Add the drinks path
      name: 'drinks',
      component: DrinksView, // Link to the DrinksView component
    },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup', component: Signup }, // Add the signup route
    {
      path: '/customers',
      name: 'customers',
      component: CustomersView,
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token');
        if (!token) {
          next('/login'); // Redirect to login if not authenticated
        } else {
          next();
        }
      }
    },
  ],
});

export default router;
