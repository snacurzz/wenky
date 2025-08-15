import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, doc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDwgvrtQEI_lMKVExy0sx7cJV0uE8HikTc",
  authDomain: "wenky-fashion.firebaseapp.com",
  projectId: "wenky-fashion",
  storageBucket: "wenky-fashion.firebasestorage.app",
  messagingSenderId: "278566676880",
  appId: "1:278566676880:web:e24e379fcacd332a6eab15"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Load selected product
let selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));
if (!selectedProduct) {
  alert("No product selected!");
  window.location.href = "home.html";
}

// Render product info
const productInfoDiv = document.getElementById("productInfo");

productInfoDiv.innerHTML = `
  <img src="${selectedProduct.image}" width="100%" height="auto" alt="${selectedProduct.name}" />
  <h3>${selectedProduct.name}</h3>
  <p>Price per item: ₹${selectedProduct.price}</p>
  <p>Total: ₹<span id="totalPrice"></span></p>
`;

const totalPriceEl = document.getElementById("totalPrice");
const quantityInput = document.getElementById("quantity");

function updateTotal() {
  const qty = parseInt(quantityInput.value) || 1;
  if (totalPriceEl) {
    totalPriceEl.textContent = selectedProduct.price * qty;
  }
}
quantityInput.addEventListener("input", updateTotal);

updateTotal();

// Place Order Function
async function confirmOrder() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  const pin = document.getElementById("pin").value.trim();
  const quantity = parseInt(quantityInput.value);
  const fullAddress = `${address}, ${city}, ${state} - ${pin}`;

  if (!name || !phone || !address || !city || !state || !pin || quantity < 1) {
    alert("Please fill all fields correctly.");
    return;
  }

  const orderData = {
    product: selectedProduct,
    quantity,
    total: selectedProduct.price * quantity,
    userInfo: { name, phone, fullAddress },
    date: new Date().toLocaleString()
  };

  localStorage.setItem("savedAddress", JSON.stringify(orderData.userInfo));
  localStorage.setItem("latestOrder", JSON.stringify(orderData));

  // Wait for Firebase to get auth state
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("Please log in.");
      window.location.href = "index.html";
      return;
    }

    const userDoc = doc(db, "orders", user.email);
    await updateDoc(userDoc, {
      items: arrayUnion(orderData)
    }).catch(async () => {
      await setDoc(userDoc, { items: [orderData] });
    });

    window.location.href = "order.html";
  });
}

window.confirmOrder = confirmOrder;
