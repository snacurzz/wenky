// ✅ profilePic.js

// Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

// ✅ Your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyD5ZWLdrORUd_hPGCEc6jFZfNmqPHWD1aU",
  authDomain: "agendalist-9c99e.firebaseapp.com",
  projectId: "agendalist-9c99e",
  storageBucket: "agendalist-9c99e.appspot.com",
  messagingSenderId: "662414426837",
  appId: "1:662414426837:web:6d505e3e5e27a61796092e"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Display user profile picture if logged in
onAuthStateChanged(auth, (user) => {
  const profileIcon = document.getElementById("profile-icon");
  if (user && user.photoURL && profileIcon) {
    profileIcon.innerHTML = `<img src="${user.photoURL}" alt="Profile" />`;
  }
});