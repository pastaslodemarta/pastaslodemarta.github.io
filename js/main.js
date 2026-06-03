// =======================================
// MENÚ HAMBURGUESA (Mobile)
// =======================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('is-active'); // Transforma la hamburguesa en X
    navLinks.classList.toggle('is-open');    // Muestra u oculta el menú
  });

  // Cerrar el menú automáticamente al tocar un link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('is-active');
      navLinks.classList.remove('is-open');
    });
  });
}

// =======================================
// LÓGICA DEL CARRITO DE COMPRAS
// =======================================
const btnAbrirCarrito = document.getElementById('btnAbrirCarrito');

if (btnAbrirCarrito) {
  let carrito = [];

  const btnCerrarCarrito = document.getElementById('btnCerrarCarrito');
  const cartModal = document.getElementById('cartModal');
  const cartCount = document.getElementById('cartCount');
  const cartItemsContainer = document.getElementById('cartItems');
  const btnEnviarWhatsApp = document.getElementById('btnEnviarWhatsApp');

  // Badge oculto al inicio (carrito vacío)
  cartCount.style.display = 'none';

  // 1. Abrir y cerrar la ventana del carrito
  btnAbrirCarrito.addEventListener('click', () => cartModal.classList.add('is-open'));
  btnCerrarCarrito.addEventListener('click', () => cartModal.classList.remove('is-open'));

  // Cerrar si hace clic fuera de la caja
  cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) cartModal.classList.remove('is-open');
  });

  // 2. Función para agregar productos
  document.querySelectorAll('.btn-agregar').forEach(boton => {
    boton.addEventListener('click', (e) => {
      const nombreProducto = e.target.getAttribute('data-nombre');
      const productoExistente = carrito.find(item => item.nombre === nombreProducto);

      if (productoExistente) {
        productoExistente.cantidad += 1;
      } else {
        carrito.push({ nombre: nombreProducto, cantidad: 1 });
      }

      actualizarVistaCarrito();

      // Pequeño efecto visual en el botón para que el usuario sepa que funcionó
      const textoOriginal = e.target.innerText;
      e.target.innerText = '¡Agregado! ✓';
      e.target.style.backgroundColor = 'var(--color-surface)';
      setTimeout(() => {
        e.target.innerText = textoOriginal;
        e.target.style.backgroundColor = '';
      }, 1200);
    });
  });

  // 3. Función para dibujar el carrito en la pantalla
  function actualizarVistaCarrito() {
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

    // Mostrar/ocultar y actualizar el badge
    if (totalItems === 0) {
      cartCount.style.display = 'none';
    } else {
      cartCount.style.display = 'flex';
      cartCount.innerText = totalItems;
    }

    // Limpiar el HTML actual
    cartItemsContainer.innerHTML = '';

    if (carrito.length === 0) {
      cartItemsContainer.innerHTML =
        '<p style="text-align:center; color:var(--color-muted); padding: 1.5rem 0;">El carrito está vacío 🛒</p>';
      return;
    }

    // Dibujar cada producto
    carrito.forEach((producto, index) => {
      const div = document.createElement('div');
      div.classList.add('cart-item');
      div.innerHTML = `
        <span style="font-weight: 500;">${producto.nombre}</span>
        <div class="cart-item__controls">
          <button class="cart-item__btn" onclick="cambiarCantidad(${index}, -1)">−</button>
          <span>${producto.cantidad}</span>
          <button class="cart-item__btn" onclick="cambiarCantidad(${index}, 1)">+</button>
        </div>
      `;
      cartItemsContainer.appendChild(div);
    });
  }

  // 4. Función global para sumar/restar desde adentro del carrito
  window.cambiarCantidad = function (index, cambio) {
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad <= 0) {
      carrito.splice(index, 1); // Lo borra si llega a 0
    }
    actualizarVistaCarrito();
  };

  // 5. Enviar el pedido a WhatsApp
  btnEnviarWhatsApp.addEventListener('click', () => {
    const clienteNombreEl = document.getElementById('clienteNombre');
    const nombreCliente = clienteNombreEl ? clienteNombreEl.value.trim() : '';

    if (carrito.length === 0) {
      alert('¡El carrito está vacío! Agregá alguna pasta primero.');
      return;
    }
    if (!nombreCliente) {
      alert('Por favor, ingresá tu nombre para poder identificar el pedido.');
      if (clienteNombreEl) clienteNombreEl.focus();
      return;
    }

    // Armamos el texto detallado del pedido
    let textoPedido = `¡Hola! Soy *${nombreCliente}*. Me gustaría hacer el siguiente pedido:\n\n`;
    carrito.forEach(item => {
      textoPedido += `• ${item.cantidad}x ${item.nombre}\n`;
    });
    textoPedido += `\n¡Quedo a la espera para coordinar!`;
    const numeroWhatsApp = '5492625531620';
    const whatsappURL = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(textoPedido)}`;

    window.open(whatsappURL, '_blank');
  });
}