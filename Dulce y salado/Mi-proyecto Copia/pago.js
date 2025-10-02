// Configuración de EmailJS
// REEMPLAZA ESTOS VALORES CON LOS TUYOS DE EMAILJS
const EMAILJS_CONFIG = {
  PUBLIC_KEY: "_6ZFD9eRyiWabdJSh", // Tu Public Key de EmailJS
  SERVICE_ID: "service_07u1dj2", // Tu Service ID
  TEMPLATE_ID: "template_wpkgpk9", // Tu Template ID
  EMAIL_TO: "m_alexandra1118@hotmail.com" // Email receptor
};
// Inicializar EmailJS
(function () {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
})();
// Función para generar ID de transacción único
function generateOrderId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `TXN-${timestamp}-${random}`;
}
// Función para mostrar mensajes
function showMessage(type, message = "") {
  const successMsg = document.getElementById("success-message");
  const errorMsg = document.getElementById("error-message");

  // Ocultar todos los mensajes
  successMsg.style.display = "none";
  errorMsg.style.display = "none";

  // Mostrar el mensaje apropiado
  if (type === "success") {
    if (message) successMsg.textContent = message;
    successMsg.style.display = "block";
  } else if (type === "error") {
    if (message) errorMsg.textContent = message;
    errorMsg.style.display = "block";
  }
}
// Función para simular procesamiento de pago
async function processPayment(paymentData) {
  // Aquí normalmente harías la llamada a tu pasarela de pagos
  // Por ahora simulamos el procesamiento
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simular éxito (90% de las veces)
      const success = Math.random() > 0.1;
      resolve(success);
    }, 2000); // Simular 2 segundos de procesamiento
  });
}
function collectOrdersData() {
  try {
    // Intentar leer desde localStorage primero
    debugger;
    const storedOrders = localStorage.getItem("carrito");

    if (storedOrders) {
      const orders = JSON.parse(storedOrders);
      console.log("📦 Órdenes cargadas desde localStorage:", orders);

      // Validar que los datos sean válidos
      if (Array.isArray(orders) && orders.length > 0) {
        const validOrders = orders.filter(
          (order) =>
            order.name && order.quantity > 0 && order.price >= 0
        );

        if (validOrders.length > 0) {
          return validOrders;
        }
      }
    }

    // Si no hay datos válidos en localStorage, leer del formulario
    console.log(
      "📝 No hay datos válidos en localStorage, leyendo del formulario..."
    );
    return false;
  } catch (error) {
    console.error("❌ Error al leer localStorage:", error);
    // En caso de error, fallback al formulario
    return false;
  }
}

//limpiar localStorage después del envío exitoso
function clearOrdersFromLocalStorage() {
  try {
    localStorage.removeItem("carrito");
    console.log("🗑️ Órdenes eliminadas del localStorage");
  } catch (error) {
    console.error("❌ Error al limpiar localStorage:", error);
  }
}
// Función para calcular totales de la factura
function calculateInvoiceTotals(orders, taxRate = 0.15) {
  const subtotaliva = orders.reduce(
    (sum, order) => sum + order.quantity * order.price,
    0
  );
  const taxAmount = subtotaliva * taxRate;
  const subtotal = subtotaliva - taxAmount;
  const total = subtotal + taxAmount;

  return {
    subtotal: subtotal.toFixed(2),
    tax: taxAmount.toFixed(2),
    total: total.toFixed(2),
    taxRate: (taxRate * 100).toFixed(0),
  };
}
async function sendPaymentEmail(paymentData) {
  // Ejemplo de órdenes - puedes modificar esto según tu estructura
  const orders = paymentData.orders || [
    {
      description: paymentData.description || "Producto/Servicio",
      quantity: 1,
      unit_price: parseFloat(paymentData.amount) || 0,
    },
  ];

  // Calcular totales
  const totals = calculateInvoiceTotals(orders);

  // Formatear órdenes para el template
  const formattedOrders = orders.map((order) => ({
    image: order.image || "https://via.placeholder.com/50", // Imagen por defecto si no hay
    name: order.name,
    quantity: order.quantity,
    price: order.price.toFixed(2),
    /* subtotal: (order.quantity * order.price).toFixed(2), */
  }));

  const templateParams = {
    customer_name: paymentData.customer_name,
    email: EMAILJS_CONFIG.EMAIL_TO,
    order_id: paymentData.order_id,
    orders: formattedOrders,
    subtotal: totals.subtotal,
    taxRate: totals.taxRate,
    tax: totals.tax,
    total: totals.total,
  };

  console.log("Enviando email con datos de factura:", templateParams);

  try {
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );

    console.log("Email enviado exitosamente:", response);
    return { success: true, response };
  } catch (error) {
    console.error("Error al enviar email:", error);
    return { success: false, error };
  }
}
// Event listener para el formulario
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("payment-form");
  const submitBtn = document.getElementById("submit-btn");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Deshabilitar botón de envío
    submitBtn.disabled = true;
    submitBtn.textContent = "Procesando...";

    try {
      // Recopilar datos del formulario
      const formData = new FormData(form);
      const paymentData = {};

      formData.forEach((value, key) => {
        paymentData[key] = value;
      });

      // Agregar órdenes al objeto de datos
      paymentData.orders = collectOrdersData();

      // Calcular totales
      const taxRate = parseFloat(paymentData.taxRate) / 100 || 0.15;
      const totals = calculateInvoiceTotals(paymentData.orders, taxRate);
      paymentData.totals = totals;


      // Agregar datos adicionales
      paymentData.order_id = generateOrderId();


      console.log("Datos del pago con órdenes:", paymentData);

      // Simular procesamiento del pago
      submitBtn.textContent = "Procesando pago...";
      const paymentSuccess = await processPayment(paymentData);

      if (!paymentSuccess) {
        showMessage(
          "error",
          "Error al procesar el pago. Verifique sus datos e intente nuevamente."
        );
        return;
      }
         function renderCart() {
          const cartElement = document.getElementById("cart");
          if (cartElement) {
      // Puedes personalizar el mensaje o el HTML según tu diseño
         cartElement.innerHTML = "<p>El carrito está vacío.</p>";
      }
    }

      // Enviar email de confirmación con factura
      submitBtn.textContent = "Enviando factura...";
      const emailResult = await sendPaymentEmail(paymentData);

      if (emailResult.success) {
        showMessage(
          "success",
          `¡Pago procesado exitosamente! Total: $${totals.total}. Se ha enviado la factura por correo.`
        );
        form.reset(); // Limpiar formulario
     
        // Limpiar localStorage después del envío exitoso
        clearOrdersFromLocalStorage();
        // Vaciar el array carrito en memoria
            if (window.carrito) {
              window.carrito = [];
            }

          // Actualizar la interfaz del carrito
          if (typeof updateCartUI === "function") {
            updateCartUI();
          }
        // Cerrar ventana modal de pago
       setTimeout(() => {
        const paymentModal = document.getElementById("payment-modal");
        if (paymentModal) {
          paymentModal.style.display = "none";
        }
      }, 2000);

      } else {
        showMessage(
          "error",
          "Pago procesado, pero hubo un error al enviar la factura. Contacte soporte."
        );
      }
    } catch (error) {
      console.error("Error general:", error);
      showMessage(
        "error",
        "Ocurrió un error inesperado. Por favor, intente nuevamente."
      );
    } finally {
      // Rehabilitar botón
      submitBtn.disabled = false;
      submitBtn.textContent = "Procesar Pago y Enviar Factura";
    }
  });
   // Formatear número de tarjeta mientras se escribe
  const cardNumberInput = document.getElementById("card-number");
  cardNumberInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\s/g, ""); // Remover espacios
    let formattedValue = value.replace(/(.{4})/g, "$1 "); // Agregar espacio cada 4 dígitos
    if (formattedValue.endsWith(" ")) {
      formattedValue = formattedValue.slice(0, -1); // Remover espacio final
    }
    e.target.value = formattedValue;
  });

});