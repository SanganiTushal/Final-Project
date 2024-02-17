import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA62-jSx61YVXAA9wxW54aMkKEUpD8Kinc",
  authDomain: "e-state-5daee.firebaseapp.com",
  projectId: "e-state-5daee",
  storageBucket: "e-state-5daee.appspot.com",
  messagingSenderId: "826317945907",
  appId: "1:826317945907:web:a2e796c4dd2b9f59b3f746",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
