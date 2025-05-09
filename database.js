// database.js (sin type="module")
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Configuración
const firebaseConfig = {
  apiKey: "AIzaSyAqOZQ5YFOdhL6dblHI5wIx10m6n4xt2Fg",
  authDomain: "buenosdeseos-twodesign.firebaseapp.com",
  databaseURL: "https://buenosdeseos-twodesign-default-rtdb.firebaseio.com",
  projectId: "buenosdeseos-twodesign",
  storageBucket: "buenosdeseos-twodesign.appspot.com",
  messagingSenderId: "577908051871",
  appId: "1:577908051871:web:27fbd4e06b3d18da14b7aa"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Exportar funciones globales
window.guardarDeseo = function(nombre, mensaje) {
  return push(ref(db, "buenos-deseos/"), {
    nombre,
    mensaje,
    timestamp: new Date().toISOString()
  });
};

window.escucharDeseos = function(callback) {
  const wishesRef = ref(db, "buenos-deseos/");
  onValue(wishesRef, (snapshot) => {
    const lista = [];
    snapshot.forEach((child) => {
      lista.push(child.val());
    });
    callback(lista);
  });
};

window.toggleWishes = function () {
  const wishesDiv = document.getElementById("wishes-container");

  // Si ya está visible, ocultamos
  if (wishesDiv.classList.contains("visible")) {
    wishesDiv.classList.remove("visible");
    wishesDiv.classList.add("hidden");
    return;
  }

  // Si aún no se han cargado los deseos (evitar cargar cada vez)
  if (!wishesDiv.dataset.loaded) {
    onValue(ref(db, "buenos-deseos/"), (snapshot) => {
      requestIdleCallback(() => {
        wishesDiv.innerHTML = ""; // Limpiar antes de actualizar

        snapshot.forEach((childSnapshot) => {
          const wish = childSnapshot.val();
          const wishElement = document.createElement("p");
          wishElement.innerHTML = `<strong>${wish.nombre}:</strong> ${wish.mensaje}`;
          wishesDiv.appendChild(wishElement);
        });

        wishesDiv.dataset.loaded = "true"; // Marcar como ya cargado
        wishesDiv.classList.remove("hidden");
        wishesDiv.classList.add("visible");
      });
    });
  } else {
    // Si ya están cargados, solo mostrar
    wishesDiv.classList.remove("hidden");
    wishesDiv.classList.add("visible");
  }
};
