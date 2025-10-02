// --- PRODUCTOS ---
const productos = [
  { id: 1, nombre: "Pan de bono", precio: 3.0, imagen: "imagenes/pandebono.jpg", badge: "NOVEDAD", descripcionCorta:"Panecillo de queso y almidón de yuca, sin gluten.", descripcionLarga: "Panecillo colombiano sin gluten, suave y esponjoso, hecho principalmente de almidón de yuca y queso.", porciones: "Individual"  },
  { id: 2, nombre: "Cocadas", precio: 12.0, imagen: "imagenes/cocadas.jpg", badge: "NOVEDAD", descripcionCorta :"Postre dulce a base de coco rallado y azúcar o panela.", descripcionLarga: "Delicioso postre elaborado a base de coco rallado, azúcar o panela.", porciones: "6 a 12 unidades" },
  { id: 3, nombre: "Alfajores de maicena", precio: 3.50, imagen: "imagenes/alfajores.jpg", badge: "PEDIDO POR ENCARGO", descripcionCorta: " Galletas suaves de almidón de maíz, rellenas de dulce de leche.", descripcionLarga: "Dos galletas tiernas elaboradas con almidón de maíz, rellenas de exquisito dulce de leche", porciones: "Individual"  },
  { id: 4, nombre: "Buñuelos", precio: 3.0, imagen: "imagenes/buñuelos.jpg", badge: "PEDIDO POR ENCARGO", descripcionCorta:"Esferas fritas de queso, fécula de maíz y almidón de yuca.", descripcionLarga: "Deliciosas esferas elaboradas con fécula de maíz, almidón de yuca y queso salado.", porciones: "Individual"  },
  { id: 5, nombre: "Empanadas", precio: 3.50, imagen: "imagenes/empanadas.jpg", badge: "PEDIDO POR ENCARGO", descripcionCorta: "Masa frita de maíz rellena de un guiso de carne y papa.", descripcionLarga: "Delicioso bocado frito hecho con una masa crujiente de maíz amarillo, rellena de un guiso de carne (res, cerdo o pollo) y papa, aderezado con especias y otros ingredientes como cebolla, pimientos y tomate.", porciones: "Individual"  },
  { id: 6, nombre: "Tequeños", precio: 2.50, imagen: "imagenes/tequeños.jpg", badge: "PEDIDO POR ENCARGO", descripcionCorta: "Palito de queso blanco envuelto en masa de trigo frita.", descripcionLarga: "Palito de queso blanco envuelto en una masa de trigo crujiente.", porciones: "Individual" }
];

window.carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const productGrid = document.getElementById("product-grid");

// --- RENDERIZAR PRODUCTOS ---
function renderProductos() {
  productGrid.innerHTML = "";
  productos.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    // Añadimos el data-id para identificar el producto fácilmente
    div.dataset.id = producto.id;
    div.innerHTML = `
      ${producto.badge ? `<div class="badge">${producto.badge}</div>` : ""}
      <div class="producto-imagen"><img src="${producto.imagen}" alt="${producto.nombre}"></div>
      <h3 class="titulo">${producto.nombre}</h3>
      <p class="detalle">${producto.descripcionCorta}</p>
      <p class="precio">${producto.precio.toFixed(2).replace('.', ',')} €</p>
      <div class="cantidad"><input type="number" value="1" min="1"></div>
      <button class="btn-comprar">Añadir <i class="fas fa-shopping-cart"></i></button>
    `;
    productGrid.appendChild(div);
  });
}

// --- CARRITO ---
function getProductData(productCard) {
  return {
    name: productCard.querySelector('.titulo').innerText,
    price: parseFloat(productCard.querySelector('.precio').innerText.replace('€','').replace(',','.')),
    image: productCard.querySelector('.producto-imagen img').src,
    quantity: parseInt(productCard.querySelector('.cantidad input').value)
  };
}

function addProductToCart(product) {
  const existing = window.carrito.find(item => item.name === product.name);
  if (existing) existing.quantity += product.quantity;
  else window.carrito.push(product);
  updateCartUI();
  openCart();
}

function removeProductFromCart(name) {
  window.carrito = window.carrito.filter(item => item.name !== name);
  updateCartUI();
}

function updateQuantity(name, change) {
  const product = window.carrito.find(item => item.name === name);
  if (product) {
    product.quantity += change;
    if (product.quantity <= 0) {
      removeProductFromCart(name);
    } else {
      updateCartUI();
    }
  }
}

function updateCartUI() {
  renderCartItems();
  updateCartCount();
  updateTotalPrice();
  localStorage.setItem("carrito", JSON.stringify(window.carrito));
}

function renderCartItems() {
  const container = document.querySelector('.cart-items');
  container.innerHTML = window.carrito.length === 0 ? '<p>Tu carrito está vacío.</p>' : '';
  window.carrito.forEach(item => {
    container.innerHTML += `
      <div class="cart-item" data-name="${item.name}">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>€${item.price.toFixed(2)}</p>
          <div class="quantity-controls">
            <button class="decrease-qty">-</button>
            <span>${item.quantity}</span>
            <button class="increase-qty">+</button>
          </div>
        </div>
        <button class="remove-btn"><i class="fas fa-trash"></i></button>
      </div>
    `;
  });
}

function updateCartCount() {
  document.querySelector('.cart-count').textContent = window.carrito.reduce((sum,item)=>sum+item.quantity,0);
}

function updateTotalPrice() {
  document.getElementById('total-price').textContent = `€${window.carrito.reduce((sum,item)=>sum + item.price*item.quantity,0).toFixed(2)}`;
}

// --- PANEL DEL CARRITO ---
const cartIcon = document.querySelector('.cart-icon');
const cartPanel = document.querySelector('.cart-panel');
const overlay = document.querySelector('.overlay');
const closeCartBtn = document.querySelector('.close-btn');

function openCart() { cartPanel.classList.add('open'); overlay.classList.add('active'); }
function closeCart() { cartPanel.classList.remove('open'); overlay.classList.remove('active'); }

cartIcon.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

// --- MODALES ---
const paymentModal = document.getElementById('payment-modal');
const productDetailModal = document.getElementById('product-detail-modal');
const btnProcessCheckout = document.getElementById('btn-process-checkout');
const closeModalBtns = document.querySelectorAll('.close-modal-btn');

function openProductDetailModal(productId) {
  const product = productos.find(p => p.id == productId);
  if (!product) return;

  document.getElementById('modal-product-image').src = product.imagen;
  document.getElementById('modal-product-title').textContent = product.nombre;
  document.getElementById('modal-product-description').innerHTML = `
    ${product.descripcionLarga}<br><strong>Porciones:</strong> ${product.porciones}`;
  document.getElementById('modal-product-price').textContent = `${product.precio.toFixed(2).replace('.', ',')} €`;

  productDetailModal.classList.add('show');
  overlay.classList.add('active');
}

btnProcessCheckout.addEventListener('click', () => {
  if (window.carrito.length === 0) {
    alert("Tu carrito está vacío. Añade productos antes de procesar la compra.");
    return;
  }
  closeCart();
  paymentModal.classList.add('show');
  overlay.classList.add('active');
});

function closeModal() {
  paymentModal.classList.remove('show');
  productDetailModal.classList.remove('show');
  overlay.classList.remove('active');
}
closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));
overlay.addEventListener('click', closeModal);

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
  renderProductos();
  updateCartUI();

  // --- Formateo del número de tarjeta ---
  const cardInput = document.getElementById("card-number");
  if (cardInput) {
    cardInput.addEventListener("input", e => {
      let value = e.target.value.replace(/\D/g, "").substring(0,16);
      value = value.replace(/(.{4})/g, "$1 ").trim();
      e.target.value = value;
    });
  }

  // --- Formateo de fecha de caducidad ---
  const expiryInput = document.getElementById("expiry-date");
  if (expiryInput) {
    expiryInput.addEventListener("input", e => {
      let value = e.target.value.replace(/\D/g, "").substring(0,4);
      if (value.length > 2) value = value.substring(0,2) + "/" + value.substring(2);
      e.target.value = value;
    });
  }

  // --- Delegación de eventos para productos ---
  productGrid.addEventListener('click', e => {
    const productCard = e.target.closest('.producto');
    if (!productCard) return;

    if (e.target.closest('.btn-comprar')) {
      const product = getProductData(productCard);
      addProductToCart(product);
    }
    if (e.target.closest('.producto-imagen')) {
      openProductDetailModal(productCard.dataset.id);
    }
  });

  // --- Delegación de eventos para carrito ---
  const cartItemsContainer = document.querySelector('.cart-items');
  cartItemsContainer.addEventListener('click', e => {
    const cartItem = e.target.closest('.cart-item');
    if (!cartItem) return;
    const productName = cartItem.dataset.name;
    if (e.target.closest('.remove-btn')) removeProductFromCart(productName);
    if (e.target.classList.contains('increase-qty')) updateQuantity(productName, 1);
    if (e.target.classList.contains('decrease-qty')) updateQuantity(productName, -1);
  });
});
