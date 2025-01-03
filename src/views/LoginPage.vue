<template>
  <div id="login" class="row flex-center login-forms">
    <Login v-if="reg" v-model:checkReg="reg" />
    <Register v-else v-model:checkReg="reg" />
  </div>
</template>

<script setup>
import Login from '../components/loginUI/Login.vue';
import Register from '../components/loginUI/Register.vue';
import { ref, watch } from 'vue';

// Estado reactivo para controlar si se muestra el login o el registro
const reg = ref(true);
</script>

<style scoped>
.bg-login {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background-image: url(/bg-login.png) !important;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  z-index: -1;
}

.login-forms {
  background-color: white;
  border-radius: 5px;
  padding: 25px;
  box-shadow: -1px -1px 6px 0 rgba(122, 221, 102, 1),
    4px 4px 16px 2px rgba(92, 162, 235, 1);
}

.app {
    box-shadow: -1px -1px 6px 0 rgba(122, 221, 102, 1),
    4px 4px 16px 2px rgba(92, 162, 235, 1);
}
</style>
