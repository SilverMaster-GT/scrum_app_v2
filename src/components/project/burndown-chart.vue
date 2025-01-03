<template>
    <div v-if="currentSprint">
      <canvas ref="chartCanvas"></canvas>
    </div>
    <div v-else>
      <p>No hay datos de sprint actuales para mostrar el gráfico.</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, computed } from 'vue';
  import { Chart, registerables } from 'chart.js';
  
  // Registrar componentes de Chart.js
  Chart.register(...registerables);
  
  const props = defineProps({
    sprints: {
      type: Array,
      required: true,
    },
  });
  
  const chartCanvas = ref(null);
  let burndownChart = null;
  
  // Encontrar el sprint actual
  const currentSprint = computed(() => {
    const now = new Date();
    return props.sprints.find(
      (sprint) => new Date(sprint.startDate) <= now && new Date(sprint.endDate) >= now
    );
  });
  
  // Crear gráfica
  const createChart = () => {
    if (!chartCanvas.value || !currentSprint.value) return;
  
    const sprint = currentSprint.value;
  
    // Calcular esfuerzo total
    const totalEffort = Object.values(sprint.tasks).reduce((sum, task) => sum + parseInt(task.fibonacci), 0);
  
    // Fechas del sprint
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  
    const labels = Array.from({ length: days }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date.toLocaleDateString();
    });
  
    // Ideal Trend
    const idealTrend = Array.from({ length: days }, (_, i) => totalEffort - (totalEffort / (days - 1)) * i);
  
    // Remaining Effort
    const remainingTrend = Array(days).fill(totalEffort);
    Object.values(sprint.tasks).forEach((task) => {
      if (task.status === 'done') {
        const closeDate = task.closeDate ? new Date(task.closeDate) : endDate;
        const daysSinceStart = Math.floor((closeDate - startDate) / (1000 * 60 * 60 * 24));
        if (daysSinceStart >= 0 && daysSinceStart < days) {
          remainingTrend[daysSinceStart] -= parseInt(task.fibonacci);
        }
      }
    });
  
    // Acumular esfuerzo restante por días
    for (let i = 1; i < days; i++) {
        remainingTrend[i] = Math.min(remainingTrend[i - 1], remainingTrend[i]);
    }

    
  
    if (burndownChart) burndownChart.destroy(); // Destruir gráfico anterior
  
    burndownChart = new Chart(chartCanvas.value, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Ideal Trend',
            data: idealTrend,
            borderColor: '#4caf50',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
          },
          {
            label: 'Remaining Effort',
            data: remainingTrend,
            borderColor: '#f44336',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${Math.round(context.raw)} points`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Dates',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Effort Points',
            },
          },
        },
      },
    });
  };
  
  // Actualizar gráfica cuando los datos cambien
  watch(() => props.sprints, createChart, { deep: true });
  onMounted(createChart);
  </script>
  
  <style scoped>
  div {
    width: 100%;
    height: 300px;
  }
  </style>
  