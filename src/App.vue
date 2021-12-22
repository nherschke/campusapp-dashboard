<template>
  <nav>
    <ul>
      <li><router-link to="/courses">Dashboard</router-link></li>
      <li class="align-right" v-if="getAuth().currentUser">
        <button @click="logout">Logout</button>
      </li>
    </ul>
  </nav>
  <router-view></router-view>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  components: {},
  setup() {
    const router = useRouter()

    const logout = () => {
      signOut(getAuth())
      router.replace('/login')
    }

    return {
      getAuth,
      logout
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

nav {
  border-bottom: 1px solid black;
  font-weight: bold;
  margin-bottom: 1rem;
}

ul {
  text-align: left;
  list-style-type: none;
  padding: 0 1rem;
}

li {
  display: inline-block;
}

router-link {
  text-decoration: none;
}

li.link {
  margin-left: 1rem;
  text-decoration: none;
}

li.align-right {
  float: right;
}
</style>
