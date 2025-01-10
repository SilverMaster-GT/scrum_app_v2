<template>
  <q-page-container>
      <q-page>
        <q-toolbar>
          <q-toolbar-title>Gestión del Backlog - Proyecto: <b>{{ project?.name }}</b></q-toolbar-title>
          <q-btn label="Crear Tarea" color="primary" @click="openTaskDialog" />
        </q-toolbar>
    
        <!-- Backlog -->
        <div>
          <h3>Backlog General</h3>
          <q-list bordered>
            <q-item v-for="(task, taskId) in backlogTasks" :key="taskId">
              <q-item-section>
                <div>{{ task.name }}</div>
                <q-badge color="primary">{{ task.status }}</q-badge>
                <q-badge color="secondary">{{ task.priority }}</q-badge>
              </q-item-section>
              <q-item-section side>
                <q-btn flat dense icon="add" @click="assignToSprint(taskId)" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
    
        <!-- Sprints -->
        <div v-for="sprint in sprints" :key="sprint.id" class="q-mt-lg">
          <h3>{{ sprint.name }}</h3>
          <q-list bordered>
            <q-item
              v-for="(task, taskId) in sprint.tasks"
              :key="taskId"
            >
              <q-item-section>
                <div>{{ task.name }}</div>
                <q-badge color="primary">{{ task.status }}</q-badge>
                <q-badge color="secondary">{{ task.priority }}</q-badge>
              </q-item-section>
              <q-item-section side>
                <q-btn flat dense icon="arrow_forward" @click="moveTask(taskId, sprint.id)" />
                <q-btn flat dense icon="close" @click="removeFromSprint(taskId, sprint.id)" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
    
        <!-- Dialog para Crear Tarea -->
        <q-dialog v-model="isTaskDialogOpen">
          <q-card style="min-width: 400px">
            <q-card-section>
              <div class="text-h6">Nueva Tarea</div>
            </q-card-section>
    
            <q-card-section>
              <q-input v-model="newTask.name" label="Nombre" outlined />
              <q-input v-model="newTask.fibonacci" label="Puntos Fibonacci" outlined />
              <q-select
                v-model="newTask.priority"
                :options="['low', 'medium', 'high']"
                label="Prioridad"
                outlined
              />
            </q-card-section>
    
            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="negative" @click="closeTaskDialog" />
              <q-btn flat label="Crear" color="primary" @click="createTask" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
  </q-page-container>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, defineProps } from "vue";
  import { useQuasar } from "quasar";
  import { db } from "../firebase";
  import { doc, getDoc } from "firebase/firestore";
  
  // Data simulada (debería provenir de Firestore)
  const project = ref({
    backlog: {},
  });

  const $q = useQuasar();
  const isTaskDialogOpen = ref(false);
  const newTask = ref({ name: "", fibonacci: "", priority: "medium" });
  const sprints = ref([]);
  const props = defineProps(['projectId']);
  
  // Computed para backlog
  const backlogTasks = computed(async () => {
    return Object.fromEntries(
      Object.entries(project.value.backlog).filter( async ([_, task]) => !task.assignedSprint)
    );
  });
  
  // Funciones
  const fetchProjectData = async () => {
    try {
      const projectRef = doc(db, 'projects', props.projectId);
      const projectSnap = await getDoc(projectRef);
      const prdata = projectSnap.data();
      prdata['backlog'] = {}
    
      if (projectSnap.exists()) {
        project.value = prdata;
        sprints.value = project.value.sprints || [];
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

  const openTaskDialog = () => (isTaskDialogOpen.value = true);
  const closeTaskDialog = () => (isTaskDialogOpen.value = false);
  
  const createTask = () => {
    if (!newTask.value.name || !newTask.value.fibonacci) {
      $q.notify({ type: "negative", message: "Por favor completa todos los campos" });
      return;
    }
  
    const taskId = `task_${Date.now()}`;
    project.value.backlog[taskId] = { ...newTask.value, status: "to-do", assignedSprint: null };
    closeTaskDialog();
    $q.notify({ type: "positive", message: "Tarea creada con éxito" });
  };
  
  const assignToSprint = (taskId) => {
    // Aquí puedes mostrar un diálogo para seleccionar el sprint al que asignar
    const sprintId = project.value.sprints[0].id; // Simulación de selección
    project.value.backlog[taskId].assignedSprint = sprintId;
    project.value.sprints[0].tasks[taskId] = project.value.backlog[taskId];
    $q.notify({ type: "positive", message: "Tarea asignada al sprint" });
  };
  
  const moveTask = (taskId, currentSprintId) => {
    const targetSprintId = project.value.sprints[1].id; // Simulación de destino
    delete project.value.sprints.find(s => s.id === currentSprintId).tasks[taskId];
    project.value.sprints.find(s => s.id === targetSprintId).tasks[taskId] = project.value.backlog[taskId];
    $q.notify({ type: "positive", message: "Tarea movida con éxito" });
  };
  
  const removeFromSprint = (taskId, sprintId) => {
    delete project.value.sprints.find(s => s.id === sprintId).tasks[taskId];
    project.value.backlog[taskId].assignedSprint = null;
    $q.notify({ type: "positive", message: "Tarea removida del sprint" });
  };

  onMounted(() => {
    fetchProjectData();
  })
  </script>
  
  <style scoped>
  .q-mt-lg {
    margin-top: 20px;
  }
  </style>
  