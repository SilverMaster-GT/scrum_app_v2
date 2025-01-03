<template>
    <div class="task-list-header">
      <div v-for="task in tasks" :key="task.id" class="task-item">
        <q-icon name="check" v-if="task.status === 'done'" color="green" />
        <q-icon name="hourglass_empty" v-else color="orange" />
        {{ task.name }} ({{ task.status }})
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps(['tasks']);
  </script>
  
  <style scoped>
    .project-header {
    margin-bottom: 20px;
    }

    .burndown-section,
    .sprint-section {
    margin-top: 20px;
    }
  </style>