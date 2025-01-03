<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade">
      <q-layout class="adjusted row flex-center">
        <Navbar />
        <component :is="Component" :key="route.path" />
      </q-layout>
    </transition>
  </router-view>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.adjusted {
  width: 98.5vw !important;
}
</style>
