import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAwlacow2iIsY9ZX_0y04JPcZobPWmasSI",
  authDomain: "whatschaap-10671.firebaseapp.com",
  projectId: "whatschaap-10671",
  storageBucket: "whatschaap-10671.appspot.com",
  messagingSenderId: "341050192784",
  appId: "1:341050192784:web:1bb5e4e20e7bf79903f915",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };