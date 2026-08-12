/* ==========================================================================
   URBIX — Lógica de la aplicación
   JavaScript Vanilla (sin frameworks ni librerías)
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Datos de productos ---------- */
  const PRODUCTS = {
    'urbix-one': {
      id: 'urbix-one',
      name: 'URBIX ONE',
      tagline: 'Tu primer impulso urbano',
      price: 14999,
      priceLabel: '$14,999 MXN',
      description: 'La entrada perfecta al mundo URBIX. Diseñada para desplazamientos urbanos diarios con la potencia justa y la autonomía ideal para trayectos cortos y medianos.',
      image: 'https://images.pexels.com/photos/36023592/pexels-photo-36023592.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      specs: {
        autonomia: '35 km',
        velocidad: '30 km/h',
        potencia: '500W',
        carga: '4 h',
        peso: '16 kg'
      },
      colors: [
        { name: 'Negro Mate', hex: '#1a1a1a', light: false },
        { name: 'Gris Grafito', hex: '#4a4a4a', light: false },
        { name: 'Blanco Lunar', hex: '#f0f0f0', light: true }
      ]
    },
    'urbix-pro': {
      id: 'urbix-pro',
      name: 'URBIX PRO',
      tagline: 'El favorito de la ciudad',
      price: 19999,
      priceLabel: '$19,999 MXN',
      description: 'El equilibrio perfecto entre potencia, autonomía y diseño. La favorita de quienes dependen de su patineta para moverse por la ciudad todos los días.',
      image: 'https://images.pexels.com/photos/26860251/pexels-photo-26860251.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      specs: {
        autonomia: '45 km',
        velocidad: '35 km/h',
        potencia: '800W',
        carga: '4 h',
        peso: '18 kg'
      },
      colors: [
        { name: 'Negro Mate', hex: '#1a1a1a', light: false },
        { name: 'Gris Grafito', hex: '#4a4a4a', light: false },
        { name: 'Verde Neón', hex: '#b6ff3a', light: true },
        { name: 'Azul Noche', hex: '#1e3a5f', light: false }
      ]
    },
    'urbix-x': {
      id: 'urbix-x',
      name: 'URBIX X',
      tagline: 'El máximo rendimiento',
      price: 25999,
      priceLabel: '$25,999 MXN',
      description: 'La cima de URBIX. Máxima autonomía, máxima velocidad y materiales premium. Para quienes no aceptan compromisos en su movilidad urbana.',
      image: 'https://images.pexels.com/photos/9660937/pexels-photo-9660937.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      specs: {
        autonomia: '60 km',
        velocidad: '40 km/h',
        potencia: '1000W',
        carga: '5 h',
        peso: '21 kg'
      },
      colors: [
        { name: 'Negro Mate', hex: '#1a1a1a', light: false },
        { name: 'Gris Grafito', hex: '#4a4a4a', light: false },
        { name: 'Verde Neón', hex: '#b6ff3a', light: true },
        { name: 'Rojo Tormenta', hex: '#8b1a1a', light: false }
      ]
    }
  };

  /* ---------- Estado del carrito ---------- */
  let cart = loadCart();
  let currentModalProduct = null;
  let currentModalColor = null;

  /* ---------- Utilidades ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const formatPrice = (n) => '$' + n.toLocaleString('es-MX') + ' MXN';

  function loadCart() {
    try {
      const saved = localStorage.getItem('urbix-cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem('urbix-cart', JSON.stringify(cart));
    } catch (e) {
      /* almacenamiento no disponible */
    }
  }

  /* ---------- Navbar: cambio visual al hacer scroll ---------- */
  const navbar = $('#navbar');
  const backToTop = $('#backToTop');

  function onScroll() {
    if (window.scrollY > 24) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
      backToTop.setAttribute('aria-hidden', 'false');
    } else {
      backToTop.classList.remove('visible');
      backToTop.setAttribute('aria-hidden', 'true');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Scroll suave para enlaces internos ---------- */
  $$('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      closeMobileMenu();
      const offset = 68;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---------- Botón volver arriba ---------- */
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Menú móvil ---------- */
  const menuToggle = $('#menuToggle');
  const mobileMenu = $('#mobileMenu');

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // animación escalonada de los enlaces
    $$('.mobile-link').forEach(function (link, i) {
      link.style.transitionDelay = (0.08 + i * 0.06) + 's';
    });
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    $$('.mobile-link').forEach(function (link) {
      link.style.transitionDelay = '0s';
    });
  }

  menuToggle.addEventListener('click', function () {
    if (mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Cerrar menú móvil con tecla Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (mobileMenu.classList.contains('open')) closeMobileMenu();
      if ($('#modalOverlay').classList.contains('open')) closeModal();
      if ($('#cartDrawer').classList.contains('open')) closeCart();
    }
  });

  /* ---------- Intersection Observer: animaciones de entrada ---------- */
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        entry.target.style.transitionDelay = delay + 'ms';
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---------- Modal de producto ---------- */
  const modalOverlay = $('#modalOverlay');
  const modalBody = $('#modalBody');
  const modalClose = $('#modalClose');

  function openModal(productId) {
    const product = PRODUCTS[productId];
    if (!product) return;
    currentModalProduct = product;
    currentModalColor = product.colors[0];

    const thumbsHtml = product.colors.map(function (c, i) {
      return '<button class="modal-thumb' + (i === 0 ? ' active' : '') + '" data-index="' + i + '" aria-label="Ver color ' + c.name + '"><img src="' + product.image + '" alt="' + product.name + ' color ' + c.name + '" /></button>';
    }).join('');

    const colorsHtml = product.colors.map(function (c, i) {
      return '<button class="modal-color' + (i === 0 ? ' active' : '') + '" data-index="' + i + '" data-light="' + c.light + '" style="background:' + c.hex + '" aria-label="Color ' + c.name + '" title="' + c.name + '"></button>';
    }).join('');

    modalBody.innerHTML =
      '<div class="modal-grid">' +
        '<div class="modal-gallery">' +
          '<div class="modal-main-img"><img src="' + product.image + '" alt="' + product.name + '" id="modalMainImg" /></div>' +
          '<div class="modal-thumbs">' + thumbsHtml + '</div>' +
        '</div>' +
        '<div class="modal-info">' +
          '<h2 id="modalTitle">' + product.name + '</h2>' +
          '<p class="modal-tagline">' + product.tagline + '</p>' +
          '<p class="modal-desc">' + product.description + '</p>' +
          '<div class="modal-price">' + product.priceLabel + '</div>' +
          '<div class="modal-colors-label">Color: <span id="modalColorName">' + currentModalColor.name + '</span></div>' +
          '<div class="modal-colors">' + colorsHtml + '</div>' +
          '<div class="modal-specs">' +
            '<div class="modal-spec"><small>Autonomía</small><span>' + product.specs.autonomia + '</span></div>' +
            '<div class="modal-spec"><small>Velocidad</small><span>' + product.specs.velocidad + '</span></div>' +
            '<div class="modal-spec"><small>Potencia</small><span>' + product.specs.potencia + '</span></div>' +
            '<div class="modal-spec"><small>Tiempo de carga</small><span>' + product.specs.carga + '</span></div>' +
            '<div class="modal-spec"><small>Peso</small><span>' + product.specs.peso + '</span></div>' +
            '<div class="modal-spec"><small>Garantía</small><span>24 meses</span></div>' +
          '</div>' +
          '<div class="modal-actions">' +
            '<button class="btn btn-outline" id="modalAddCart">Añadir al carrito</button>' +
            '<button class="btn btn-primary" id="modalBuyNow">Comprar ahora</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    // Reemplazar el contenido del modal manteniendo el botón de cerrar
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Eventos dentro del modal
    $$('.modal-thumb', modalBody).forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        $$('.modal-thumb', modalBody).forEach(function (t) { t.classList.remove('active'); });
        thumb.classList.add('active');
      });
    });

    $$('.modal-color', modalBody).forEach(function (colorBtn) {
      colorBtn.addEventListener('click', function () {
        $$('.modal-color', modalBody).forEach(function (c) { c.classList.remove('active'); });
        colorBtn.classList.add('active');
        const idx = parseInt(colorBtn.getAttribute('data-index'), 10);
        currentModalColor = product.colors[idx];
        $('#modalColorName', modalBody).textContent = currentModalColor.name;
      });
    });

    $('#modalAddCart', modalBody).addEventListener('click', function () {
      addToCart(product, currentModalColor);
      closeModal();
      openCart();
    });

    $('#modalBuyNow', modalBody).addEventListener('click', function () {
      addToCart(product, currentModalColor);
      closeModal();
      openCart();
    });
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalBody.innerHTML = '';
    currentModalProduct = null;
    currentModalColor = null;
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeModal();
  });

  // Botones "Ver modelo" y "Comprar" de la tabla
  $$('.js-open-modal').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(btn.getAttribute('data-product'));
    });
  });

  // Abrir modal al hacer clic en la tarjeta de producto
  $$('.product-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('.js-open-modal')) return;
      const productId = card.getAttribute('data-product');
      openModal(productId);
    });
  });

  /* ---------- Carrito de compras ---------- */
  const cartBtn = $('#cartBtn');
  const cartDrawer = $('#cartDrawer');
  const cartOverlay = $('#cartOverlay');
  const cartClose = $('#cartClose');
  const cartItems = $('#cartItems');
  const cartFooter = $('#cartFooter');
  const cartCount = $('#cartCount');
  const cartHeaderCount = $('#cartHeaderCount');
  const cartTotal = $('#cartTotal');
  const cartClear = $('#cartClear');

  function addToCart(product, color) {
    const existing = cart.find(function (item) {
      return item.id === product.id && item.colorName === color.name;
    });
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        colorName: color.name,
        colorHex: color.hex,
        qty: 1
      });
    }
    saveCart();
    renderCart();
    pulseCartIcon();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
  }

  function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty < 1) {
      cart[index].qty = 1;
    }
    saveCart();
    renderCart();
  }

  function getCartCount() {
    return cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
  }

  function getCartTotal() {
    return cart.reduce(function (sum, item) { return sum + item.price * item.qty; }, 0);
  }

  function pulseCartIcon() {
    cartBtn.classList.add('pulse');
    setTimeout(function () { cartBtn.classList.remove('pulse'); }, 400);
  }

  function renderCart() {
    const count = getCartCount();
    cartCount.textContent = count;
    cartHeaderCount.textContent = count;
    if (count > 0) {
      cartCount.classList.add('visible');
    } else {
      cartCount.classList.remove('visible');
    }

    if (cart.length === 0) {
      cartItems.innerHTML =
        '<div class="cart-empty">' +
          '<div class="cart-empty-icon"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>' +
          '<p>Tu carrito está vacío</p>' +
          '<p style="font-size:13px;margin-top:4px">Agrega un modelo para empezar.</p>' +
        '</div>';
      cartFooter.hidden = true;
      return;
    }

    cartFooter.hidden = false;
    cartItems.innerHTML = cart.map(function (item, i) {
      return (
        '<div class="cart-item">' +
          '<div class="cart-item-img"><img src="' + item.image + '" alt="' + item.name + '" /></div>' +
          '<div class="cart-item-info">' +
            '<div class="cart-item-top">' +
              '<div><div class="cart-item-name">' + item.name + '</div><div class="cart-item-color">' + item.colorName + '</div></div>' +
              '<button class="cart-item-remove" data-index="' + i + '" aria-label="Eliminar ' + item.name + ' del carrito"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>' +
            '</div>' +
            '<div class="cart-item-bottom">' +
              '<div class="cart-qty">' +
                '<button data-index="' + i + '" data-delta="-1" class="cart-qty-btn" aria-label="Disminuir cantidad">−</button>' +
                '<span>' + item.qty + '</span>' +
                '<button data-index="' + i + '" data-delta="1" class="cart-qty-btn" aria-label="Aumentar cantidad">+</button>' +
              '</div>' +
              '<div class="cart-item-price">' + formatPrice(item.price * item.qty) + '</div>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    cartTotal.textContent = formatPrice(getCartTotal());

    // Eventos de los botones generados dinámicamente
    $$('.cart-item-remove', cartItems).forEach(function (btn) {
      btn.addEventListener('click', function () {
        removeFromCart(parseInt(btn.getAttribute('data-index'), 10));
      });
    });
    $$('.cart-qty-btn', cartItems).forEach(function (btn) {
      btn.addEventListener('click', function () {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const delta = parseInt(btn.getAttribute('data-delta'), 10);
        changeQty(idx, delta);
      });
    });
  }

  function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  cartBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);
  cartClear.addEventListener('click', function () {
    cart = [];
    saveCart();
    renderCart();
  });

  /* ---------- FAQ Acordeones ---------- */
  $$('.faq-question').forEach(function (question) {
    question.addEventListener('click', function () {
      const item = question.parentElement;
      const answer = question.nextElementSibling;
      const isOpen = item.classList.contains('open');

      // Cerrar todos los demás
      $$('.faq-item').forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      // Toggle del actual
      if (isOpen) {
        item.classList.remove('open');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Formulario de contacto: validación ---------- */
  const contactForm = $('#contactForm');
  const contactSuccess = $('#contactSuccess');

  function showError(fieldId, message) {
    const errorEl = $('#' + fieldId + 'Error');
    const inputEl = $('#' + fieldId);
    errorEl.textContent = message;
    inputEl.classList.add('invalid');
  }

  function clearError(fieldId) {
    const errorEl = $('#' + fieldId + 'Error');
    const inputEl = $('#' + fieldId);
    errorEl.textContent = '';
    inputEl.classList.remove('invalid');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    const cleaned = phone.replace(/[\s\-()]/g, '');
    return /^\+?\d{10,13}$/.test(cleaned);
  }

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    const name = $('#cName').value.trim();
    const email = $('#cEmail').value.trim();
    const phone = $('#cPhone').value.trim();
    const message = $('#cMessage').value.trim();

    // Nombre
    if (name.length < 2) {
      showError('cName', 'Por favor ingresa tu nombre (mínimo 2 caracteres).');
      valid = false;
    } else {
      clearError('cName');
    }

    // Email
    if (!email) {
      showError('cEmail', 'El email es obligatorio.');
      valid = false;
    } else if (!isValidEmail(email)) {
      showError('cEmail', 'Ingresa un email válido.');
      valid = false;
    } else {
      clearError('cEmail');
    }

    // Teléfono
    if (!phone) {
      showError('cPhone', 'El teléfono es obligatorio.');
      valid = false;
    } else if (!isValidPhone(phone)) {
      showError('cPhone', 'Ingresa un teléfono válido (10-13 dígitos).');
      valid = false;
    } else {
      clearError('cPhone');
    }

    // Mensaje
    if (message.length < 10) {
      showError('cMessage', 'Tu mensaje debe tener al menos 10 caracteres.');
      valid = false;
    } else {
      clearError('cMessage');
    }

    if (valid) {
      contactSuccess.hidden = false;
      contactForm.reset();
      setTimeout(function () { contactSuccess.hidden = true; }, 5000);
    }
  });

  // Limpiar errores al escribir
  ['cName', 'cEmail', 'cPhone', 'cMessage'].forEach(function (id) {
    $('#' + id).addEventListener('input', function () { clearError(id); });
  });

  /* ---------- Newsletter ---------- */
  const newsletterForm = $('#newsletterForm');
  const newsletterSuccess = $('#newsletterSuccess');
  const newsletterError = $('#newsletterError');

  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = $('#newsletterEmail').value.trim();

    if (!email) {
      newsletterError.textContent = 'El email es obligatorio.';
      newsletterError.hidden = false;
      newsletterSuccess.hidden = true;
      return;
    }
    if (!isValidEmail(email)) {
      newsletterError.textContent = 'Ingresa un email válido.';
      newsletterError.hidden = false;
      newsletterSuccess.hidden = true;
      return;
    }

    newsletterError.hidden = true;
    newsletterSuccess.hidden = false;
    newsletterForm.reset();
    setTimeout(function () { newsletterSuccess.hidden = true; }, 4000);
  });

  /* ---------- Inicialización ---------- */
  renderCart();
  onScroll();

  // Abrir automáticamente el primer item del FAQ para guiar al usuario
  // (comentado para no interferir con la animación de reveal)
  // const firstFaq = $('.faq-item');
  // if (firstFaq) firstFaq.querySelector('.faq-question').click();

})();
