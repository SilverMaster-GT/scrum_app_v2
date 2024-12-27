<template>
    <div class="size">
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="email"
            label="Correo"
            hint="Correo electronico"
            dense
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Por favor ingrese su correo']"
          />
    
          <q-input
            filled
            :type="passortext"
            v-model="password"
            label="Contraseña"
            dense
            lazy-rules
            :rules="[
              val => val !== null && val !== '' || 'Por favor ingrese su contraseña',
              val => val.length >= 8 && val.length < 16 || 'Su contraseña no cumple el estandar'
            ]"
          />
    
          <q-toggle v-model="accept" @click="showPassword" label="mostrar contraseña?" />
          
          <q-chip clickable @click="changeToRegister()" text-color="black" icon="person_add">
            Crear cuenta de usuario
          </q-chip>

          <div>
            <q-btn label="Iniciar Sesión" type="submit" color="primary"/>
          </div>
        </q-form>
    </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref, toRef } from 'vue'
import { Auth } from '../../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'vue-router';

const $q = useQuasar();

const email = ref(null);
const password = ref(null);
const accept = ref(false);
const passortext = ref('password');
const router = useRouter();

// Props y eventos
const props = defineProps(['checkReg']); // Recibe el estado desde el padre
const emit = defineEmits(['update:checkReg']); // Declara el evento para actualizar el padre

const onSubmit = async () => {
    try {
        const userCredential = await signInWithEmailAndPassword(Auth, email.value, password.value);
        $q.notify({
            message: 'Usuario autenticado',
            icon: 'done_all',
            color: 'secondary'
        });
        router.push('/dashboard');
    } catch (error) {
        $q.notify({
            message: 'Error al iniciar sesión:'+error.message,
            icon: 'gpp_bad',
            color: 'negative'
        });
    }
}

const showPassword = () => {
    passortext.value = accept.value ? null : 'password'
}

const changeToRegister = () => {
    emit('update:checkReg', false);
}

</script>

<style scoped>
.size {
    width: 300px;
}
</style>