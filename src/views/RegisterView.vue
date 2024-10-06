<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-900">
    <div class="w-full max-w-xs">
      <form @submit.prevent="handleRegister" class="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 class="mb-4 text-xl font-bold text-gray-100">Register</h2>
        <div v-if="errorMessage" class="text-red-400 mb-4">{{ errorMessage }}</div>
        <div class="mb-4">
          <label class="block text-gray-300 text-sm font-bold mb-2" for="username">
            Username
          </label>
          <input v-model="username" class="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-gray-300 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" required>
        </div>
        <div class="mb-4">
          <label class="block text-gray-300 text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input v-model="email" class="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-gray-300 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" required>
        </div>
        <div class="mb-6">
          <label class="block text-gray-300 text-sm font-bold mb-2" for="password">
            Password
          </label>
          <input v-model="password" class="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-gray-300 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="**********" required>
        </div>
        <div class="flex items-center justify-between">
          <button class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { register } from '../services/authService';

export default {
  name: 'RegisterView',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      errorMessage: null,
    };
  },
  methods: {
    async handleRegister() {
      try {
        const user = await register(this.username, this.email, this.password);
        this.$store.commit('setUser', user);
        this.$router.push('/');
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
  },
};
</script>