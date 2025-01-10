<template>
    <q-page style="min-height: auto;">
      <q-btn label="Crear Sprint" color="primary" @click="isDialogOpen = true; users = props.ProjectData.users;" />
  
      <!-- Dialog -->
      <q-dialog v-model="isDialogOpen">
        <q-card style="min-width: 500px">
          <q-card-section>
            <div class="text-h6">Crear Nuevo Sprint</div>
          </q-card-section>
  
          <q-card-section>
            <!-- Nombre del Sprint -->
            <q-input
              v-model="newSprint.name"
              label="Nombre del Sprint"
              outlined
              dense
              required
            />
  
            <!-- Fecha de inicio -->
            <q-input
              v-model="newSprint.startDate"
              label="Fecha de inicio"
              type="date"
              outlined
              dense
            />
  
            <!-- Fecha de fin -->
            <q-input
              v-model="newSprint.endDate"
              label="Fecha de fin"
              type="date"
              outlined
              dense
            />
  
            <!-- Meta del Sprint -->
            <q-input
              v-model="newSprint.sprintGoal"
              label="Meta del Sprint"
              outlined
              dense
              type="textarea"
              rows="3"
            />
  
            <!-- Miembros del equipo -->
            <q-select
              v-model="newSprint.team"
              :options="users"
              label="Miembros del equipo"
              outlined
              dense
              multiple
              use-chips
            />
          </q-card-section>
  
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="negative" @click="closeDialog" />
            <q-btn flat label="Crear" color="primary" @click="createSprint" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </template>
  
  <script setup>
  import { ref, defineProps } from "vue";
  import { useQuasar } from "quasar";
  import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
  import { db } from '../../firebase';
  
  // Reactividad
  const isDialogOpen = ref(false);
  const newSprint = ref({
    name: "",
    startDate: "",
    endDate: "",
    sprintGoal: "",
    team: []
  });
  const props = defineProps(['ProjectData','projectId'])
  const sprints = ref([]);
  
  // Usuarios disponibles (pueden venir de un API o Firestore)
  const users = ref([]);
  
  // Acceso a las utilidades de Quasar
  const $q = useQuasar();
  
  // Función para resetear el formulario
  const resetForm = () => {
    newSprint.value = {
      name: "",
      startDate: "",
      endDate: "",
      sprintGoal: "",
      team: []
    };
  };
  
  // Cerrar el diálogo
  const closeDialog = () => {
    isDialogOpen.value = false;
    resetForm();
  };
  
  // Crear el Sprint
  const createSprint = () => {
    if (!newSprint.value.name || !newSprint.value.startDate || !newSprint.value.endDate) {
      $q.notify({
        type: "negative",
        message: "Por favor llena todos los campos obligatorios"
      });
      return;
    }
  
    if (new Date(newSprint.value.startDate) >= new Date(newSprint.value.endDate)) {
      $q.notify({
        type: "negative",
        message: "La fecha de inicio debe ser anterior a la fecha de fin"
      });
      return;
    }

    try {
      createNewSprintFirestore(
        props.ProjectData,
        null,
        newSprint.value.name,
        newSprint.value.startDate,
        newSprint.value.endDate,
        newSprint.value.team,
        newSprint.value.sprintGoal,
    )
    $q.notify({
      type: "positive",
      message: "Sprint creado con éxito"
    });
    } catch (error) {
      console.log(error)
    }
  
  };

  // crear un nuevo sprint:
  async function createNewSprintFirestore(
    sprintData, 
    sprintId, 
    name, 
    startDate, 
    endDate, 
    teamMembers = [], 
    sprintGoal = "", 
    backlog = {}
) {
    if (!name || !startDate || !endDate) {
      console.error("El nombre, la fecha de inicio y la fecha de fin son obligatorios.");
      return null;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      console.error("La fecha de inicio debe ser anterior a la fecha de fin.");
      return null;
    }

    // Crear el nuevo sprint
    const newSprint = {
      id: sprintId || `Sprint ${sprintData.sprints.length + 1}`,
      name,
      startDate,
      endDate,
      tasks: {}, // Inicialmente vacío
      team: teamMembers,
      sprintGoal,
      backlog
    };

    sprints.value = props.ProjectData?.sprints;

    try {
      // Referencia a la colección de sprints
      const projectRef = doc(db, "projects", props.projectId);

      // Guardar en Firestore
      const goal = await updateDoc(projectRef, {sprints: arrayUnion(newSprint)});

      console.log(goal);

      console.log(`Sprint "${name}" creado con éxito y guardado en Firebase.`);
      return newSprint;
    } catch (error) {
      console.error("Error al guardar el sprint en Firebase:", error);
      return null;
    } finally {
      closeDialog();
    }
  }

  </script>
  
  <style scoped>
  /* Personaliza estilos aquí */
  </style>
  