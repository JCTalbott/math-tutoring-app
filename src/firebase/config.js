import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCQl4CdZz9BYBuAnTt04UaY7IKk3uMEugc",
  authDomain: "math-tutoring-app-2db05.firebaseapp.com",
  projectId: "math-tutoring-app-2db05",
  storageBucket: "math-tutoring-app-2db05.firebasestorage.app",
  messagingSenderId: "798727666603",
  appId: "1:798727666603:web:c97438645662340c7e70ee",
  measurementId: "G-TB5KN827EM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;