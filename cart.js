document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cartItems");

  if (cart.length === 0) {
    container.innerHTML = "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Your cart is empty 😢</p>";
    
    // Clear total if empty
    const totalAmountSpan = document.getElementById("totalAmount");
    if (totalAmountSpan) totalAmountSpan.textContent = "0";

    return;
  }

  displayCartItems(cart);
  calculateTotal(cart);

  function displayCartItems(cartItems) {
    container.innerHTML = "";

    cartItems.forEach((item, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "item-box"; // Apply style here

      // Make whole wrapper clickable with JS
      wrapper.onclick = () => {
        window.location.href = `product.html?id=${item.id}`;
      };

      // Inner content (image, name, price)
      wrapper.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="item-img" />
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>
      `;

      // Delete button (must not trigger the redirection)
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = (event) => {
        event.stopPropagation(); // Prevent redirect
        removeFromCart(index);
      };

      wrapper.appendChild(deleteBtn);
      container.appendChild(wrapper);
    });
  }

  window.removeFromCart = function(index) {
    const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
    updatedCart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    location.reload();
  };

  // ✅ New Feature: Calculate total amount
  function calculateTotal(cartItems) {
    let total = 0;
    cartItems.forEach(item => {
      total += parseFloat(item.price);
    });
    const totalAmountSpan = document.getElementById("totalAmount");
    if (totalAmountSpan) {
      totalAmountSpan.textContent = total;
    }
  }

  // ✅ New Feature: Handle "Buy All" button
  const buyBtn = document.querySelector(".buy-button");
  if (buyBtn) {
    buyBtn.addEventListener("click", () => {
      const total = document.getElementById("totalAmount").textContent;
      alert("Proceeding to buy all items worth ₹" + total);
      // Optional: clear cart or redirect to checkout
      // localStorage.removeItem("cart");
      // window.location.href = "checkout.html";
    });
  }
});