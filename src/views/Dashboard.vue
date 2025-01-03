<template>
      <q-page-container class="adjusted">
        <q-page class="dashboard">
          <div class="dashboard-header">
            <h4>Bienvenido, {{ userName }}</h4>
            <q-btn 
              color="negative" 
              label="Cerrar sesión" 
              icon="logout" 
              @click="logout"
            />
          </div>
      
          <div class="dashboard-content">
            <q-btn
              color="primary"
              label="Agregar Proyecto"
              icon="add"
              @click="showAddProjectDialog = true"
              class="q-mb-md"
            />

            <q-card
              flat
              bordered
              class="module-card"
              v-for="project in projects"
              :key="project.id"
            >
              <q-card-section>
                <h4 style="">{{ project.name }}</h4>
                <div class="details-section">
                  <p>{{ project.description }}</p>
                </div>
                <small>Usuarios: {{ Array.isArray(project.users) ? project.users.join(', ') : 'Sin usuarios' }}</small>
              </q-card-section>
              <q-separator />
              <q-card-actions align="around">
                <q-btn color="secondary" label="Ver Proyecto" @click="navigateTo(project.id)" />
                <q-btn
                  flat
                  icon="group"
                  color="primary"
                  class="q-ml-sm"
                  @click="editUsers(project)"
                />
                <q-btn
                  flat
                  icon="delete"
                  color="negative"
                  class="q-ml-sm"
                  @click="deleteProject(project.id)"
                />
              </q-card-actions>
            </q-card>
          </div>

          <!-- Dialogo para agregar proyectos -->
          <q-dialog v-model="showAddProjectDialog">
            <q-card>
              <q-card-section>
                <div class="text-h6">Agregar Proyecto</div>
              </q-card-section>
              <q-card-section>
                <q-input filled v-model="newProject.name" label="Nombre del Proyecto" />
                <q-input
                  filled
                  v-model="newProject.description"
                  label="Descripción"
                  type="textarea"
                />
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat label="Cancelar" color="negative" v-close-popup />
                <q-btn flat label="Guardar" color="primary" @click="addProject" />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <!-- Dialogo para editar usuarios -->
          <q-dialog v-model="showEditUsersDialog">
            <q-card>
              <q-card-section>
                <div class="text-h6">Gestionar Usuarios para {{ selectedProject?.name }}</div>
              </q-card-section>
              <q-card-section>
                <q-input
                  v-model="newUserEmail"
                  label="Correo electrónico"
                  filled
                  @keyup.enter="addUserToProject"
                />
                <q-list bordered>
                  <q-item v-for="user in selectedProject?.users" :key="user">
                    <q-item-section>{{ user }}</q-item-section>
                    <q-item-section side>
                      <q-btn flat icon="remove_circle" color="negative" @click="removeUserFromProject(user)" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat label="Cerrar" color="primary" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
          
        </q-page>
      </q-page-container>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { Auth, db } from '../firebase';
  import { signOut } from 'firebase/auth';
  import { ref, onMounted  } from 'vue';
  import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
  
  const router = useRouter();
  const userName = ref(Auth.currentUser?.email || 'Usuario');
  const projects = ref([]);
  const showAddProjectDialog = ref(false);
  const showEditUsersDialog = ref(false);
  const newProject = ref({ name: '', description: '' });
  const newUserEmail = ref('');
  const selectedProject = ref(null);

  // Cargar proyectos desde Firestore
  const loadProjects = async () => {
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, where("users", "array-contains", Auth.currentUser?.email));
      const querySnapshot = await getDocs(q);
      projects.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.log("Error al cargar proyectos: " + error.message);
    }
  };

  // Agregar un nuevo proyecto
  const addProject = async () => {
    if (newProject.value.name && newProject.value.description) {
      try {
        await addDoc(collection(db, 'projects'), {
          name: newProject.value.name,
          description: newProject.value.description,
          users: [Auth.currentUser?.email], // El creador es el primer usuario
        });
        newProject.value = { name: '', description: '' };
        showAddProjectDialog.value = false;
      } catch (error) {
        console.error('Error al agregar proyecto:', error);
      } finally {
        loadProjects();
      }
    }
  };

  // Eliminar un proyecto
  const deleteProject = async (id) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
    } finally {
      loadProjects();
    }
  };

  // Navegar a un proyecto específico
  const navigateTo = (id) => {
    router.push(`/project/${id}`);
  };

  // Gestionar usuarios
  const editUsers = (project) => {
    selectedProject.value = project;
    newUserEmail.value = '';
    showEditUsersDialog.value = true;
  };

  const addUserToProject = async () => {
    if (newUserEmail.value) {
      const updatedUsers = [...selectedProject.value.users, newUserEmail.value];
      try {
        await updateDoc(doc(db, 'projects', selectedProject.value.id), {
          users: updatedUsers,
        });
        newUserEmail.value = '';
      } catch (error) {
        console.error('Error al agregar usuario:', error);
      } finally {
        loadProjects();
      }
    }
  };

  const removeUserFromProject = async (user) => {
    const updatedUsers = selectedProject.value.users.filter((u) => u !== user);
    try {
      await updateDoc(doc(db, 'projects', selectedProject.value.id), {
        users: updatedUsers,
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    } finally {
      loadProjects();
    }
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

  // Inicializar datos
  onMounted(() => {
    loadProjects();
  });
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

  .adjusted {
    padding-left: 215px !important;
  }

  .details-section::-webkit-scrollbar {
    width: 5px;     /* Tamaño del scroll en vertical */
    height: 5px;    /* Tamaño del scroll en horizontal */
    /* display: none;  /* Ocultar scroll */
  }
  /* Ponemos un color de fondo y redondeamos las esquinas del thumb */
  .details-section::-webkit-scrollbar-thumb {
    background: #595959;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  /* Cambiamos el fondo y agregamos una sombra cuando esté en hover */
  .details-section::-webkit-scrollbar-thumb:hover {
    background: #b3b3b3;
    box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
  }

  /* Cambiamos el fondo cuando esté en active */
  .details-section::-webkit-scrollbar-thumb:active {
    background-color: #999999;
  }
  /* Ponemos un color de fondo y redondeamos las esquinas del track */
  .details-section::-webkit-scrollbar-track {
    background: #e1e1e1;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  /* Cambiamos el fondo cuando esté en active o hover */
  .details-section::-webkit-scrollbar-track:hover,
  .details-section::-webkit-scrollbar-track:active {
    background: #d4d4d4;
  }
  
  .details-section {
    height: 4em;
    overflow-y: auto;
    margin-bottom: 10px;
    box-shadow: 3px 3px 6px rgba(0,0,0,0.3), -3px -3px 6px rgba(255,255,255,0.8);
    border-radius: 5px;
    scrollbar-width: 5px;
  }
  </style>
  