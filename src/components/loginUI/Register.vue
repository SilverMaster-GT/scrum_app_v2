<template>
    <div class="size">
        <q-form
          @submit="onRegister"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="email"
            label="Correo"
            hint="Correo electronico"
            lazy-rules
            dense
            :rules="[ val => val && val.length > 0 || 'Por favor ingrese su correo']"
          />
    
          <q-input
            filled
            :type="passortext"
            v-model="password"
            label="Contraseña"
            lazy-rules
            dense
            :rules="[
              val => val !== null && val !== '' || 'Por favor ingrese su contraseña',
              val => val.length >= 8 && val.length < 16 || 'Su contraseña no cumple el estandar'
            ]"
          />

          <q-input
            filled
            :type="passortext"
            v-model="confirmPassword"
            label="Confirmar contraseña"
            dense
            lazy-rules
            :rules="[val => val === password || 'Las contraseñas no coinciden']"
          />
    
          <q-toggle v-model="accept" @click="showPassword" label="mostrar contraseña?" />

          <q-chip clickable @click="changeToLogin()" text-color="black" icon="login">
            Ya tengo una cuenta
          </q-chip>
    
          <div>
            <q-btn label="Registrarse" type="submit" color="primary"/>
          </div>
        </q-form>
    </div>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { Auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Estados reactivos para los campos del formulario
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const passortext = ref('password');
const accept = ref(false);

// Propiedades y eventos
const props = defineProps(['checkReg']);
const emit = defineEmits(['update:checkReg']);

// Manejo de notificaciones
const $q = useQuasar();

const showPassword = () => {
    passortext.value = accept.value ? null : 'password'
}

// Función para registrarse
const onRegister = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(Auth, email.value, password.value);
    $q.notify({
      message: 'Usuario registrado exitosamente',
      icon: 'done_all',
      color: 'positive',
    });

    // Cambia al formulario de inicio de sesión
    emit('update:checkReg', true);
  } catch (error) {
    $q.notify({
      message: `Error al registrarse: ${error.message}`,
      icon: 'error',
      color: 'negative',
    });
  }
};

// Cambiar al formulario de inicio de sesión
const changeToLogin = () => {
  console.log('registro salio')
  emit('update:checkReg', true); // Cambiar al formulario de login
};


</script>

<style scoped>
.size {
    width: 300px;
}

:root {
    color: black;
}
</style>