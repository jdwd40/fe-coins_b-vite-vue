<template>
    <nav class="bg-blue-500 p-4">
      <div class="container mx-auto flex justify-between items-center">
        <div class="text-white text-lg font-bold">
          Fantasy Crypto Exchange
        </div>
        <div>
          <router-link class="text-white mr-4" to="/">Home</router-link>
          <router-link class="text-white mr-4" to="/login">Login</router-link>
          <router-link class="text-white mr-4" to="/register">Register</router-link>
          <router-link class="text-white mr-4" to="/portfolio">Portfolio</router-link>
          <router-link class="text-white" to="/market">Market</router-link>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'Navbar',
  };
  </script>
  