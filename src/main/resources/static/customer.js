// Customer Dashboard Functionality

const API_BASE_URL = 'http://localhost:8080';

// Words that don't help image search — we skip these
const STOP_WORDS = new Set([
  'a','an','the','of','in','on','with','for','and','or','by','to',
  'is','it','its','this','that','as','at','be','my','our','your',
  'new','best','good','great','top','super','ultra','pro','max',
  'item','product','pack','set','lot','piece','unit','box','kit'
]);

const PRODUCT_IMAGE_RULES = [
  { words: ['wireless', 'headphone'], path: '/images/wireless-headphones.svg' },
  { words: ['smart', 'watch'], path: '/images/smart-watch.svg' },
  { words: ['office', 'chair'], path: '/images/office-chair.svg' },
  { words: ['coffee', 'mug'], path: '/images/coffee-mug.svg' },
  { words: ['chocolate'], path: '/images/chocolate.svg' }
];

function resolveLocalProductImage(productName, photoUrl) {
  if (photoUrl && photoUrl.trim().startsWith('/images/')) {
    return photoUrl.trim();
  }

  const name = (productName || '').toLowerCase();
  const matchedRule = PRODUCT_IMAGE_RULES.find((rule) =>
    rule.words.every((word) => name.includes(word))
  );
  if (matchedRule) {
    return matchedRule.path;
  }

  if (photoUrl && photoUrl.trim() !== '') {
    return photoUrl.trim();
  }

  return '';
}

function bestKeyword(productName) {
  const words = (productName || 'product')
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .toLowerCase()
    .trim()
    .split(/\s+/);
  const meaningful = words.find(w => w.length > 3 && !STOP_WORDS.has(w));
  return meaningful || words[0] || 'product';
}

function getProductImage(productId, productName, photoUrl) {
  const localImage = resolveLocalProductImage(productName, photoUrl);
  if (localImage) {
    return localImage;
  }

  const kw = bestKeyword(productName);
  return `https://loremflickr.com/280/200/${kw}?lock=${productId}`;
}

// DOM Elements
const navLinks        = document.querySelectorAll('.nav-link');
const sections        = document.querySelectorAll('.section');
const logoutBtn       = document.getElementById('logoutBtn');
const productsContainer = document.getElementById('productsContainer');
const searchInput     = document.getElementById('searchInput');
const cartIcon        = document.getElementById('cartIcon');
const cartCount       = document.getElementById('cartCount');
const cartItems       = document.getElementById('cartItems');
const cartFooter      = document.getElementById('cartFooter');
const userInfo        = document.getElementById('userInfo');
const productModal    = document.getElementById('productModal');

let allProducts = [];
let cart = [];
let selectedProductForModal = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
  setupEventListeners();
  loadAllProducts();
  loadCart();
});

// ─── Auth ───────────────────────────────────────────────────────────────────
function checkAuthentication() {
  const session = sessionStorage.getItem('userSession');
  if (!session) { window.location.href = '/'; return; }
  try {
    const userData = JSON.parse(session);
    userInfo.textContent = `Welcome, ${userData.username}`;
  } catch (error) {
    window.location.href = '/';
  }
}

// ─── Event Listeners ────────────────────────────────────────────────────────
function setupEventListeners() {
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToSection(link.dataset.section);
    });
  });

  searchInput.addEventListener('input', handleSearch);
  logoutBtn.addEventListener('click', handleLogout);

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);

  cartIcon.addEventListener('click', () => navigateToSection('cart'));
}

// ─── Navigation ─────────────────────────────────────────────────────────────
function navigateToSection(sectionId) {
  sections.forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === sectionId) link.classList.add('active');
  });

  if (sectionId === 'products') loadAllProducts();
  else if (sectionId === 'cart') renderCart();
}

// ─── Products ───────────────────────────────────────────────────────────────
async function loadAllProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/viewAllProduct`);
    if (!response.ok) throw new Error('Failed to fetch products');
    allProducts = await response.json();
    renderProducts(allProducts);
  } catch (error) {
    console.error('Error loading products:', error);
    productsContainer.innerHTML = '<p class="no-data error">Failed to load products. Please try again.</p>';
  }
}

function renderProducts(products) {
  if (products.length === 0) {
    productsContainer.innerHTML = '<p class="no-data">No products available at the moment.</p>';
    return;
  }

  productsContainer.innerHTML = products.map(product => {
    const inCart = cart.some(item => item.id === product.id);
    const imgUrl = getProductImage(product.id, product.name, product.photoUrl);
    return `
      <div class="product-card customer-product-card">
        <div class="product-img-wrap">
          <img
            src="${imgUrl}"
            alt="${escapeHtml(product.name)}"
            class="product-img"
            onerror="this.onerror=null; this.style.display='none'"
          >
        </div>
        <div class="product-info">
          <h4>${escapeHtml(product.name)}</h4>
          <p class="product-desc">${escapeHtml(product.description)}</p>
          <p><strong>Stock:</strong> ${product.quantity} units</p>
          <p class="product-price">&#8377;${parseFloat(product.price).toFixed(2)}</p>
        </div>
        <div class="product-actions customer-actions">
          <button class="blue-btn ${inCart ? 'in-cart-btn' : ''}"
                  onclick="addToCart(${product.id}, '${escapeHtml(product.name)}', ${product.price}, '${product.photoUrl || ''}')">
            ${inCart ? '&#10003; In Cart' : 'Add to Cart'}
          </button>
          <button class="secondary-btn" onclick="viewProductDetails(${product.id})">View Details</button>
        </div>
      </div>
    `;
  }).join('');
}

function handleSearch() {
  const query = searchInput.value.toLowerCase();
  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query)
  );
  renderProducts(filtered);
}

// ─── Product Modal ──────────────────────────────────────────────────────────
function viewProductDetails(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  selectedProductForModal = product;
  document.getElementById('modalProductName').textContent  = product.name;
  document.getElementById('modalProductDesc').textContent  = product.description;
  document.getElementById('modalPrice').textContent        = parseFloat(product.price).toFixed(2);
  document.getElementById('modalStock').textContent        = product.quantity;
  document.getElementById('quantityInput').value           = 1;
  document.getElementById('quantityInput').max             = product.quantity;

  productModal.classList.add('show');
}

function closeProductModal() {
  productModal.classList.remove('show');
  selectedProductForModal = null;
}

function addToCartFromModal() {
  if (!selectedProductForModal) return;
  const quantity = parseInt(document.getElementById('quantityInput').value);
  if (quantity > selectedProductForModal.quantity) {
    alert('Quantity exceeds available stock');
    return;
  }
  // Add once with the desired quantity instead of looping
  const existing = cart.find(item => item.id === selectedProductForModal.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id:       selectedProductForModal.id,
      name:     selectedProductForModal.name,
      price:    parseFloat(selectedProductForModal.price),
      quantity: quantity,
      photoUrl: selectedProductForModal.photoUrl || ''
    });
  }
  saveCart();
  updateCartUI();
  renderProducts(allProducts);
  closeProductModal();
}

// ─── Cart Management ────────────────────────────────────────────────────────
function addToCart(productId, productName, price, photoUrl) {
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id: productId, name: productName, price: parseFloat(price), quantity: 1, photoUrl: photoUrl || '' });
  }
  saveCart();
  updateCartUI();
  renderProducts(allProducts);
}

// FIX: always call renderCart() after mutating cart so the cart section updates
function removeFromCart(productId) {
  // productId arrives as a number from the onclick literal
  cart = cart.filter(item => item.id !== Number(productId));
  saveCart();
  updateCartUI();
  renderCart();           // ← was missing: cart section now re-renders instantly
  renderProducts(allProducts);
}

function updateQuantity(productId, newQuantity) {
  // FIX: newQuantity from onchange="...this.value" is a string → parseInt it
  const qty  = parseInt(newQuantity, 10);
  const item = cart.find(i => i.id === Number(productId));
  if (!item) return;

  if (isNaN(qty) || qty <= 0) {
    removeFromCart(productId);
  } else {
    item.quantity = qty;
    saveCart();
    updateCartUI();
    renderCart();
  }
}

function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    cart = [];
    saveCart();
    updateCartUI();
    renderCart();
    renderProducts(allProducts);
  }
}

function saveCart() {
  sessionStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
  const saved = sessionStorage.getItem('cart');
  if (saved) {
    try { cart = JSON.parse(saved); } catch { cart = []; }
  }
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  cartCount.textContent = totalItems;
  document.getElementById('summaryItems').textContent = totalItems;
  document.getElementById('summaryTotal').textContent  = totalPrice.toFixed(2);
}

// ─── Render Cart ─────────────────────────────────────────────────────────────
function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="no-data">Your cart is empty. Start shopping!</p>';
    cartFooter.style.display = 'none';
    return;
  }

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <img src="${getProductImage(item.id, item.name, item.photoUrl)}" alt="${escapeHtml(item.name)}"
             class="cart-item-img"
             onerror="this.onerror=null; this.style.display='none'">
        <div>
          <h4>${escapeHtml(item.name)}</h4>
          <p>Price: &#8377;${parseFloat(item.price).toFixed(2)}</p>
        </div>
      </div>
      <div class="cart-item-controls">
        <div class="quantity-control">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">&#8722;</button>
          <input type="number" value="${item.quantity}" min="1"
                 onchange="updateQuantity(${item.id}, parseInt(this.value, 10))">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">&#43;</button>
        </div>
        <p class="item-total">&#8377;${(item.price * item.quantity).toFixed(2)}</p>
        <button class="delete-btn small" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    </div>
  `).join('');

  document.getElementById('grandTotal').textContent = total.toFixed(2);
  cartFooter.style.display = 'block';
}

// ─── Checkout ────────────────────────────────────────────────────────────────
function handleCheckout() {
  if (cart.length === 0) { alert('Your cart is empty'); return; }

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const orderSummary = [
    'Order Summary:',
    ...cart.map(i => `• ${i.name} x${i.quantity}: ₹${(i.price * i.quantity).toFixed(2)}`),
    '',
    `Total: ₹${total.toFixed(2)}`,
    '',
    'Thank you for shopping with us!'
  ].join('\n');

  alert(orderSummary);
  cart = [];
  saveCart();
  updateCartUI();
  renderCart();
  navigateToSection('products');
}

// ─── Logout ──────────────────────────────────────────────────────────────────
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/';
  }
}

// ─── Utilities ───────────────────────────────────────────────────────────────
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

window.addEventListener('click', (e) => {
  if (e.target === productModal) closeProductModal();
});
