<template>
  <div>
    <span>
      <button>+</button>
    </span>
    <div class="grid">
      <div class="grid-item">Question</div>
      <div class="grid-item">Something</div>
      <div class="grid-item">Another thing</div>
      <div class="grid-item">What?</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Quiz',
  setup() {
    console.log('hi')
  }
}
</script>


<style scoped>
div.grid {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

div.grid-item {
  border: 1px solid red;
  padding: 20%;
}
</style>