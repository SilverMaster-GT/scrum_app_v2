<template>
  <!-- Drawer para menú lateral en dispositivos pequeños -->
  <div class="q-gutter-md">
    <q-drawer v-if="drawer" v-model="drawer" :breakpoint="700" :width="200"  elevated side="left">
      <q-list>
        <q-item to="/" clickable>
          <q-item-section>Home</q-item-section>
        </q-item>
        <q-item to="/about" clickable>
          <q-item-section>About</q-item-section>
        </q-item>
        <q-item v-if="user" to="/dashboard" clickable>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        <q-item v-if="user" clickable @click="logout">
          <q-item-section>Logout</q-item-section>
        </q-item>
        <q-item v-else to="/login" clickable>
          <q-item-section>Login</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { Auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default {
  name: "Navbar",
  setup() {
    const drawer = ref(false); // Controla el menú lateral
    const user = ref(null);

    onMounted(() => {
      onAuthStateChanged(Auth, (currentUser) => {
        user.value = currentUser;
        currentUser ? drawer.value = true: drawer.value = false;
      });
    });

    const logout = async () => {
      try {
        await signOut(Auth);
        user.value = null;
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    };

    return {
      drawer,
      user,
      logout,
    };
  },
};
</script>

<style scoped>
/* Estilos personalizados si es necesario */
</style>