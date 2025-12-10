const firebaseConfig = {
    apiKey: "AIzaSyA2OhMnrIgbR1GvuINihs28XyACEAYgm3Y",
  authDomain: "apihub-22441.firebaseapp.com",
  projectId: "apihub-22441",
  storageBucket: "apihub-22441.firebasestorage.app",
  messagingSenderId: "664309433102",
  appId: "1:664309433102:web:4a3b13bdf1137c17b64d5f",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
