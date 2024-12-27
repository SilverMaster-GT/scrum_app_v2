<template>
          <q-toolbar>
            <!-- Menú desplegable para dispositivos pequeños -->
            <q-btn
              flat
              round
              dense
              icon="menu"
              aria-label="Menu"
              @click="drawer = !drawer"
              class="q-mr-md"
            />
      
            <!-- Título o Logo -->
            <q-toolbar-title>
              <div>Mi Aplicación</div>
            </q-toolbar-title>
      
            <!-- Navegación para pantallas grandes -->
            <q-btn flat dense label="Home" to="/" />
            <q-btn flat dense label="About" to="/about" />
            <q-btn
              v-if="user"
              flat
              dense
              label="Dashboard"
              to="/dashboard"
            />
            <q-btn
              v-if="user"
              flat
              dense
              label="Logout"
              icon="logout"
              @click="logout"
            />
            <q-btn
              v-else
              flat
              dense
              label="Login"
              to="/login"
            />
          </q-toolbar>
      
        <!-- Drawer para menú lateral en dispositivos pequeños -->
        <div class="q-gutter-md">
          <q-layout>
              <q-drawer v-model="drawer" side="left">
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
          </q-layout>
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
  