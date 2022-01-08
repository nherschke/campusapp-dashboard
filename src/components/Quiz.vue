<template>
  <h1>Quizzes</h1>
  <div v-if="create === false">
    <span>
      <button @click.prevent="create = true">+ Neues Quiz</button>
    </span>
    <div class="grid">
      <div
        v-for="quiz in quizzes"
        :key="quiz.id"
        :class="'grid-item' + (quiz.active ? ' active' : ' inactive')"
      >
        <p>{{ quiz.createdAt.toDate().toLocaleDateString('de-DE') }}</p>
        <p>
          <b v-if="quiz.active">Läuft</b>
          <b v-else>Abgeschlossen</b>
        </p>
        <h2>{{ quiz.question }}</h2>
        <h3>{{ quiz.choices === 'yesno' ? 'Ja/Nein' : 'A/B/C/D' }}</h3>
        <button v-if="quiz.active" @click="stop(quiz.id)">Stoppen</button>
        <button @click="deleteQuiz(quiz.id)">Löschen</button>
      </div>
    </div>
  </div>
  <div v-else>
    <form @submit.prevent="onSubmit(question, picked)">
      <label class="label" for="question">Frage</label>
      <input type="text" id="question" v-model="question" required>
      <label class="label">Wahlmöglichkeiten</label>
      <label
        class="form-control"
        for="yesno"
      >
        <input
          type="radio"
          name="choices"
          id="yesno"
          value="yesno"
          v-model="picked"
          required
        >Ja/Nein
      </label>
      <label
        class="form-control"
        for="abcd"
      >
        <input
          type="radio"
          name="choices"
          id="abcd"
          value="abcd"
          v-model="picked"
        >A/B/C/D
      </label>
      <input type="submit">
    </form>
  </div>
</template>

<script>
import { onUnmounted, ref } from 'vue'
import { collection, getFirestore, addDoc, Timestamp, updateDoc, doc, onSnapshot, deleteDoc } from 'firebase/firestore'
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
          active: false
        }
      )
    }

    /**
     * Deletes a quiz
     */
    const deleteQuiz = async (quizId) => {
      await deleteDoc(doc(getFirestore(), `courses/${courseId}/quizzes`, quizId))
    }

    const onSubmit = async (_question, choices) => {
      const quiz = {
        question: _question,
        choices,
        active: true,
        createdAt: Timestamp.now(),
        voted: [],
        votes: {}
      }

      if (choices === 'yesno') {
        quiz.votes = { 'yes': 0, 'no': 0}
      } else {
        quiz.votes = { 'a': 0, 'b': 0, 'c': 0, 'd': 0 }
      }

      // Add quiz to database
      await addDoc(collection(getFirestore(), `courses/${courseId}/quizzes`), quiz)
      // Empty input fields
      question.value = ''
      picked.value = ''
      // Turn off creation mode
      create.value = false
    }

    return {
      create,
      quizzes,
      question,
      picked,
      stop,
      deleteQuiz,
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
  border-radius: 7px;
  padding: 10px 0;
}

div.active {
  background: #fa8128;
}

div.inactive {
  background: #fda172;
}

form {
  width: 50%;
  margin: 0 auto;
}

label.label {
  font-size: 24px;
  display: inline-block;
  margin: 10px 0;
}

input[type=text] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 20px;
}

.form-control {
  font-family: system-ui, sans-serif;
  font-size: 18px;
  display: block;
}

input[type=submit] {
  font-size: 20px;
  width: 100%;
  background-color: #fa8128;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button {
  font-size: 16px;
  font-weight: bold;
  background-color: #fa8128;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 7px;
  cursor: pointer;
}
</style>