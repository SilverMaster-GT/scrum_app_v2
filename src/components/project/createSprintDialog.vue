<template>
    <q-page>
      <q-btn label="Crear Sprint" color="primary" @click="isDialogOpen = true" />
  
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
  
  // Reactividad
  const isDialogOpen = ref(false);
  const newSprint = ref({
    name: "",
    startDate: "",
    endDate: "",
    sprintGoal: "",
    team: []
  });
  const props = defineProps([SprintData])
  
  // Usuarios disponibles (pueden venir de un API o Firestore)
  const users = ref([
    "user1@gmail.com",
    "user2@gmail.com",
    "user3@gmail.com"
  ]);
  
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
  
    // Emitir evento o lógica personalizada
    $q.notify({
      type: "positive",
      message: "Sprint creado con éxito"
    });
  
    closeDialog();
  };
  </script>
  
  <style scoped>
  /* Personaliza estilos aquí */
  </style>
  