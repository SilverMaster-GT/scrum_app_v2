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
            <q-btn label="Sprint" color="primary" @click="navigateTo('sprint')" />
            <q-btn label="Backlog" color="primary" @click="navigateTo('backlog')" />
            <q-btn label="WorkItems" color="primary" @click="navigateTo('workitems')" />
            <q-btn label="Boards" color="primary" @click="navigateTo('boards')" />
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
        </q-card>
  
        <!-- Sprint Anterior -->
        <q-card v-if="previousSprintTasks.length" class="sprint-section project-header">
          <q-card-section>
            <h4>Sprint Anterior</h4>
            <task-list :tasks="previousSprintTasks" />
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { collection, doc, getDoc } from 'firebase/firestore';
  import { db } from '../firebase';
  import burndownChart from '../components/project/burndown-chart.vue';
  import taskList from '../components/project/task-list.vue';
  import { useQuasar } from 'quasar';
  
  // Datos reactivos
  const project = ref(null);
  const sprints = ref([]);
  const currentSprint = ref(null);
  const previousSprintTasks = ref([]);
  const previousSprint = ref([])
  const props = defineProps(['projectId']);
  const $q = useQuasar();
  
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
            previousSprintTasks.value = Object.values(previousSprint.value.tasks).find(
                (task) => task.status !== 'done'
            );
        }
      } else {
        console.error('El proyecto no existe en Firestore');
      }
    } catch (error) {
      console.error('Error al cargar el proyecto:', error);
    }
  };
  
  // Navegación
  const navigateTo = (section) => {
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