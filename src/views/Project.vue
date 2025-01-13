<template>
    <q-page-container>
      <q-page class="project-page">
        <!-- Información del Proyecto -->
        <q-card class="project-header">
          <q-card-section>
            <h3>{{ project?.name }}</h3>
            <p>{{ project?.description }}</p>
          </q-card-section>
          <q-card-actions>
            <create-sprint-dialog :ProjectData="project" :projectId="props?.projectId"/>
            <q-btn label="Crear Sprint" color="primary" style="display: none;" />
            <q-btn label="Backlog" color="primary" @click="navigateTo('backlog/'+props?.projectId)" />
            <q-btn label="WorkItems" color="primary" @click="navigateTo('workitems')" />
            <q-btn label="Boards" color="primary" @click="navigateTo('boards')" />
            <q-btn icon="room_preferences" color="primary" @click="navigateTo('config/'+props?.projectId)" />
          </q-card-actions>
        </q-card>
  
        <!-- Gráfica Burndown -->
        <div class="burndown-section project-header" v-if="sprints.length">
          <h4>Burndown Trend</h4>
          <burndown-chart :sprints="sprints" />
        </div>
        <div v-else>
          <p>No hay sprints agendados.</p>
        </div>
  
        <!-- Sprint Actual -->
        <q-card v-if="currentSprint" class="sprint-section project-header">
          <q-card-section>
            <h4>Sprint Actual: {{ currentSprint.name }}</h4>
            <task-list :tasks="currentSprint.tasks" />
          </q-card-section>
          <q-btn label="ver Sprint" color="primary" @click="navigateTo('sprint')" />
        </q-card>
  
        <!-- Sprint Anterior -->
        <q-card v-if="previousSprintTasks.length" class="sprint-section project-header">
          <q-card-section>
            <h4>Sprint Anterior</h4>
            <task-list :tasks="previousSprintTasks" />
          </q-card-section>
          <q-btn label="ver Sprint" color="primary" @click="navigateTo('sprint')" />
        </q-card>
      </q-page>
    </q-page-container>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
  import { db } from '../firebase';
  import burndownChart from '../components/project/burndown-chart.vue';
  import taskList from '../components/project/task-list.vue';
  import createSprintDialog from '../components/project/createSprintDialog.vue';
  import { useQuasar } from 'quasar';
  import { useRouter } from 'vue-router';
  
  // Datos reactivos
  const project = ref(null);
  const sprints = ref([]);
  const currentSprint = ref(null);
  const previousSprintTasks = ref([]);
  const previousSprint = ref([])
  const props = defineProps(['projectId']);
  const $q = useQuasar();
  const router = useRouter();
  
  // Cargar datos del proyecto
  const fetchProjectData = async () => {
    try {
      const projectRef = doc(db, 'projects', props.projectId);
      const projectSnap = await getDoc(projectRef);
    
      if (projectSnap.exists()) {
        project.value = projectSnap.data();
        sprints.value = project.value.sprints || [];

        // Determinar sprint actual y tareas del sprint anterior
        const now = new Date();
        currentSprint.value = sprints.value.find(
          (sprint) => new Date(sprint.startDate) <= now && new Date(sprint.endDate) >= now
        );
        
        previousSprint.value = sprints.value.find(
          (sprint) => new Date(sprint.endDate) < now
        );
        
        if (Object.values(previousSprint).length > 1) {
            previousSprintTasks.value = Object.values(previousSprint.value.tasks).filter(
                (task) => task.status !== 'done'
            );
        }
      } else {
        $q.notify({
            message: 'Error',
            icon: 'error_outline',
            caption: 'El proyecto no existe en Firestore, <br> verifique o seleccione un proyecto valido desde el dashboard',
            color: 'primary',
            html: true,
            progress: true,
        });
      }
    } catch (error) {
      console.error('', error);
      $q.notify({
            message: 'Error',
            icon: 'error_outline',
            caption: `Error al cargar el proyecto: ${error}`,
            color: 'primary',
            html: true,
            progress: true,
        });
    }
  };
  
  // Navegación
  const navigateTo = (section) => {
    router.push(section);
    $q.notify({
        message: `Navegando a: ${section}`,
        icon: "arrow_circle_right",
        color: "primary"
    });
    // Agregar navegación según sea necesario
  };
  
  onMounted(() => {
    fetchProjectData();
  });
  </script>
  
<style scoped>
.project-header {
    width: 80%;
    margin: 0 auto;
    margin-top: 15px;
    margin-bottom: 15px;
}
</style>