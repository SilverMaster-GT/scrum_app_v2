<template>
      <q-page-container>
        <q-page class="dashboard">
          <div class="dashboard-header">
            <h3>Bienvenido, {{ userName }}</h3>
            <q-btn 
              color="negative" 
              label="Cerrar sesión" 
              icon="logout" 
              @click="logout"
            />
          </div>
      
          <div class="dashboard-content">
            <q-card flat bordered class="module-card" v-for="module in modules" :key="module.name">
              <q-card-section>
                <q-icon :name="module.icon" size="xl" />
              </q-card-section>
              <q-card-section>
                <h3>{{ module.name }}</h3>
                <p>{{ module.description }}</p>
              </q-card-section>
              <q-btn color="primary" :label="`Ir a ${module.name}`" @click="navigateTo(module.route)" />
            </q-card>
          </div>
        </q-page>
      </q-page-container>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { Auth } from '../firebase';
  import { signOut } from 'firebase/auth';
  import { ref } from 'vue';
  
  const router = useRouter();
  const userName = ref(Auth.currentUser?.email || 'Usuario');
  
  // Opciones del dashboard
  const modules = [
    {
      name: 'Módulo 1',
      description: 'Descripción del módulo 1.',
      route: '/modulo1',
      icon: 'dashboard',
    },
    {
      name: 'Módulo 2',
      description: 'Descripción del módulo 2.',
      route: '/modulo2',
      icon: 'settings',
    },
    {
      name: 'Módulo 3',
      description: 'Descripción del módulo 3.',
      route: '/modulo3',
      icon: 'folder',
    },
  ];
  
  // Navegación a módulos
  const navigateTo = (route) => {
    router.push(route);
  };
  
  // Función de cerrar sesión
  const logout = async () => {
    try {
      await signOut(Auth);
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  </script>
  
  <style scoped>
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .dashboard-content {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .module-card {
    width: 300px;
    text-align: center;
  }
  </style>
  