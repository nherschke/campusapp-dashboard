import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index'

/* Firebase */
import { initializeApp } from 'firebase/app'

// Initialize the Firebase app
initializeApp({
  apiKey: 'AIzaSyDOmnkk-r_DFtikCTyHrMXxpSfv7z9K5ws',
  authDomain: 'campus-app-521d0.firebaseapp.com',
  projectId: 'campus-app-521d0',
  storageBucket: 'campus-app-521d0.appspot.com',
  messagingSenderId: '66703311140',
  appId: '1:66703311140:web:378705cef1f7d0996733b1'
})

const app = createApp(App)
app.use(router)
app.mount('#app')
