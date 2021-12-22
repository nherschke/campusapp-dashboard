<template>
  <h1>Meine Kurse</h1>
  <div class="grid">
    <div class="grid-item" v-for="course in courses" :key="course.id">
      <h2>{{ course.name }}</h2>
      <h3>{{ course.room }}</h3>
      <router-link :to="`/courses/${course.id}/quiz`">Quiz</router-link>
      <router-link :to="`/courses/${course.id}/fragen`">Fragen</router-link>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export default {
  setup() {
    const courses = ref([])

    const q = query(
      collection(getFirestore(), 'courses'),
      where('profId', '==', getAuth().currentUser.uid)
    )
    getDocs(q).then(querySnapshot => {
      querySnapshot.forEach(doc => {
        courses.value.push({ id: doc.id, ...doc.data() })
      })
    })

    return {
      courses
    }
  }
}
</script>

<style>
div.grid {
  margin-top: 1rem;
  padding: 0 100px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

div.grid-item {
  color: #fff;
  background: #fa8128;
  border-radius: 7px;
  padding: 10px 0;
}
</style>