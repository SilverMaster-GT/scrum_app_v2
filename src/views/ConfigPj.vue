<template>
  <q-page-container>
      <q-page padding>
        <q-toolbar>
          <q-toolbar-title>Configuración del Proyecto</q-toolbar-title>
        </q-toolbar>
    
        <q-tabs v-model="currentTab" class="text-grey">
          <q-tab name="general" label="General" icon="settings" />
          <q-tab name="sprints" label="Sprints" icon="calendar_today" />
          <q-tab name="users" label="Usuarios" icon="people" />
        </q-tabs>
    
        <q-tab-panels v-model="currentTab" animated>
          <!-- Configuración General -->
          <q-tab-panel name="general">
            <q-card>
              <q-card-section>
                <q-input v-model="project.name" label="Nombre del Proyecto" outlined />
                <q-input
                  v-model="project.description"
                  label="Descripción del Proyecto"
                  outlined
                  type="textarea"
                />
                <q-date v-model="project.startDate" label="Fecha de Inicio" outlined />
                <q-date v-model="project.endDate" label="Fecha de Fin" outlined />
              </q-card-section>
              <q-card-actions align="right">
                <q-btn label="Guardar Cambios" color="primary" @click="saveGeneralConfig" />
              </q-card-actions>
            </q-card>
          </q-tab-panel>
    
          <!-- Configuración de Sprints -->
          <q-tab-panel name="sprints">
            <q-list bordered>
              <q-item v-for="(sprint, index) in project.sprints" :key="sprint.id">
                <q-item-section>
                  <q-input v-model="sprint.name" label="Nombre del Sprint" outlined />
                  <q-date v-model="sprint.startDate" label="Inicio" outlined />
                  <q-date v-model="sprint.endDate" label="Fin" outlined />
                </q-item-section>
                <q-item-section>
                  <q-btn
                    label="Ver Detalles"
                    color="primary"
                    @click="viewSprintDetails(sprint.id)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
            <q-btn label="Agregar Sprint" color="secondary" @click="addSprint" />
          </q-tab-panel>
    
          <!-- Configuración de Usuarios -->
          <q-tab-panel name="users">
            <q-list bordered>
              <q-item v-for="(user, index) in project.users" :key="index">
                <q-item-section>{{ user }}</q-item-section>
                <q-item-section>
                  <q-btn
                    icon="delete"
                    color="negative"
                    flat
                    @click="removeUser(user)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
            <q-input v-model="newUserEmail" label="Agregar Usuario" outlined />
            <q-btn label="Añadir" color="primary" @click="addUser" />
          </q-tab-panel>
        </q-tab-panels>
      </q-page>
  </q-page-container>
</template>
  
<script setup>
import { ref } from "vue";

// Mock inicial del proyecto
const project = ref({
  name: "Scrum_App",
  description: "Descripción inicial del proyecto",
  startDate: "2024-12-16",
  endDate: "2025-01-16",
  sprints: [
    {
      id: "sprint1",
      name: "Sprint 1",
      startDate: "2024-12-16",
      endDate: "2024-12-27",
      tasks: [],
    },
  ],
  users: ["user1@example.com", "user2@example.com"],
});

const currentTab = ref("general");
const newUserEmail = ref("");

const saveGeneralConfig = () => {
  console.log("Configuración guardada: ", project.value);
};

const addSprint = () => {
  const newSprint = {
    id: `sprint${project.value.sprints.length + 1}`,
    name: `Sprint ${project.value.sprints.length + 1}`,
    startDate: "",
    endDate: "",
    tasks: [],
  };
  project.value.sprints.push(newSprint);
};

const viewSprintDetails = (sprintId) => {
  console.log("Ver detalles del sprint: ", sprintId);
};

const addUser = () => {
  if (newUserEmail.value.trim()) {
    project.value.users.push(newUserEmail.value.trim());
    newUserEmail.value = "";
  }
};

const removeUser = (user) => {
  project.value.users = project.value.users.filter((u) => u !== user);
};
</script>
