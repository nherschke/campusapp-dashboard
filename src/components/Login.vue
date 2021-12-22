<template>
  <form @submit.prevent="onSubmit(email, password)">
    <label for="email">E-Mail</label>
    <input type="email" name="email" v-model="email" required>
    <label for="password">Passwort</label>
    <input type="password" name="password" v-model="password" required>
    <input type="submit" value="submit">
  </form>
</template>

<script>
import { ref } from 'vue'
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()

    const email = ref('')
    const password = ref('')

    const onSubmit = (email, password) => {
      signInWithEmailAndPassword(getAuth(), email, password)
        .then(() => router.push('/courses'))
    }

    return {
      email,
      password,
      onSubmit
    }
  }
}
</script>