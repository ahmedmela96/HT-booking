import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userRef = doc(db, "users", email);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const role = userSnap.data().role;

      if (role === "admin") {
        window.location.href = "admin.html";
      } else if (role === "office") {
        window.location.href = "dashboard.html";
      } else {
        loginError.textContent = "نوع الحساب غير معروف.";
      }
    } else {
      loginError.textContent = "الحساب غير مسجل في قاعدة البيانات.";
    }
  } catch (error) {
    console.error(error);
    loginError.textContent = "بيانات الدخول غير صحيحة!";
  }
});
