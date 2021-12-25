<template>
  <h1>Quizzes</h1>
  <div v-if="create === false">
    <span>
      <button @click.prevent="create = true">+ Neues Quiz</button>
    </span>
    <div class="grid">
      <div
        class="grid-item" v-for="quiz in quizzes"
        :key="quiz.id"
        :style="quiz.status === 'inactive' ? 'background: #fda172;' : ''"
      >
        <p>{{ quiz.createdAt.toDate().toLocaleDateString('de-DE') }}</p>
        <h2>{{ quiz.question }}</h2>
        <h3>{{ quiz.choices === 'yesno' ? 'Ja/Nein' : 'A/B/C/D' }}</h3>
        <button v-if="quiz.status === 'active'" @click="stop(quiz.id)">Stoppen</button>
      </div>
    </div>
  </div>
  <div v-else>
    <form @submit.prevent="onSubmit(question, picked)">
      <label for="question">Frage</label>
      <input type="text" v-model="question" required>
      <p>Wahlmöglichkeiten</p>
      <input
        type="radio"
        name="choices"
        id="yesno"
        value="yesno"
        v-model="picked"
        required
      >
      <label for="yesno">Ja/Nein</label>
      <input
        type="radio"
        name="choices"
        id="abcd"
        value="abcd"
        v-model="picked"
      >
      <label for="abcd">A/B/C/D</label>
      <input type="submit">
    </form>
  </div>
</template>

<script>
import { onUnmounted, ref } from 'vue'
import { collection, getFirestore, addDoc, Timestamp, updateDoc, doc, onSnapshot } from 'firebase/firestore'
import { useRoute } from 'vue-router'

export default {
  name: 'Quiz',
  setup() {
    const create = ref(false)

    const quizzes = ref([])

    const question = ref('')
    const picked = ref('')

    const route = useRoute()
    const courseId = route.params.id

    const unsubscribe = onSnapshot(
      collection(getFirestore(), `courses/${courseId}/quizzes`),
      querySnapshot => {
        quizzes.value = []
        querySnapshot.forEach(doc => {
          quizzes.value.push({ id: doc.id, ...doc.data() })
        })
      }
    )
    onUnmounted(() => unsubscribe())

    /**
     * Sets the status of a quiz as inactive
     */
    const stop = async (quizId) => {
      await updateDoc(
        doc(getFirestore(), `courses/${courseId}/quizzes`, quizId),
        {
          status: 'inactive'
        }
      )
    }

    const onSubmit = async (question, choices) => {
      // Add quiz to database
      await addDoc(
        collection(getFirestore(), `courses/${courseId}/quizzes`),
        {
          question,
          choices,
          status: 'active',
          createdAt: Timestamp.now()
        }
      )
      // Turn off creation mode
      create.value = false
    }

    return {
      create,
      quizzes,
      question,
      picked,
      stop,
      onSubmit
    }
  }
}
</script>


<style scoped>
div.grid {
  margin-top: 1rem;
  padding: 0 100px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

div.grid-item {
  color: #fff;
  background: #fa8128;
  border-radius: 7px;
  padding: 10px 0;
}
</style>