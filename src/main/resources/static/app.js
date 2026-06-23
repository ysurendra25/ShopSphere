// API Configuration
const API_BASE_URL = 'http://localhost:8080';

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const addProductForm = document.getElementById('addProductForm');
const updateProductForm = document.getElementById('updateProductForm');
const logoutBtn = document.getElementById('logoutBtn');
const productsContainer = document.getElementById('productsContainer');
const searchInput = document.getElementById('searchInput');
const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const totalProductsElement = document.getElementById('totalProducts');

let allProducts = [];
let selectedProductIdForDelete = null;
let currentUpdateProductId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadAllProducts();
  updateStats();
});

// Setup Event Listeners
function setupEventListeners() {
  // Navigation
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = link.dataset.section;
      navigateToSection(sectionId);
    });
  });

  // Add Product Form
  addProductForm.addEventListener('submit', handleAddProduct);

  // Update Product Form
  updateProductForm.addEventListener('submit', handleUpdateProduct);

  // Search
  searchInput.addEventListener('input', handleSearch);

  // Logout
  logoutBtn.addEventListener('click', handleLogout);

  // Delete Modal
  confirmDeleteBtn.addEventListener('click', confirmDelete);
}

// Navigation
function navigateToSection(sectionId) {
  // Update active section
  sections.forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');

  // Update active nav link
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === sectionId) {
      link.classList.add('active');
    }
  });

  // Load section-specific data
  if (sectionId === 'products') {
    loadAllProducts();
  } else if (sectionId === 'dashboard') {
    updateStats();
  }
}

// Products Management
async function loadAllProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/viewAllProduct`);
    if (!response.ok) throw new Error('Failed to fetch products');
    
    allProducts = await response.json();
    renderProducts(allProducts);
    updateStats();
  } catch (error) {
    console.error('Error loading products:', error);
    showMessage('productsContainer', 'Failed to load products', 'error');
  }
}

function renderProducts(products) {
  if (products.length === 0) {
    productsContainer.innerHTML = '<p class="no-data">No products found. Start by adding a product!</p>';
    return;
  }

  productsContainer.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="product-info">
        <h4>${escapeHtml(product.name)}</h4>
        <p>${escapeHtml(product.description)}</p>
        <p><strong>Product ID:</strong> ${product.id}</p>
        <p><strong>Quantity:</strong> ${product.quantity}</p>
        <p class="product-price">₹${parseFloat(product.price).toFixed(2)}</p>
      </div>
      <div class="product-actions">
        <button class="edit-btn" onclick="editProduct(${product.id})">Edit</button>
        <button class="delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

function handleSearch() {
  const query = searchInput.value.toLowerCase();
  const filtered = allProducts.filter(product => 
    product.name.toLowerCase().includes(query) ||
    product.id.toString().includes(query)
  );
  renderProducts(filtered);
}

// Add Product
async function handleAddProduct(e) {
  e.preventDefault();

  const productData = {
    name: document.getElementById('productName').value.trim(),
    description: document.getElementById('productDescription').value.trim(),
    price: parseFloat(document.getElementById('productPrice').value),
    quantity: parseInt(document.getElementById('productQuantity').value)
  };

  if (!validateProductData(productData)) {
    showMessage('addMessage', 'Please fill all fields correctly', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/addproducts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });

    if (!response.ok) throw new Error('Failed to add product');

    const message = await response.text();
    showMessage('addMessage', message, 'success');
    addProductForm.reset();
    
    setTimeout(() => {
      loadAllProducts();
      navigateToSection('products');
    }, 1500);
  } catch (error) {
    console.error('Error adding product:', error);
    showMessage('addMessage', 'Error adding product. Please try again.', 'error');
  }
}

// Edit/Update Product
function editProduct(productId) {
  loadProductForUpdate();
  document.getElementById('updateProductId').value = productId;
  loadProductForUpdate();
}

async function loadProductForUpdate() {
  const productId = document.getElementById('updateProductId').value.trim();

  if (!productId) {
    showMessage('updateMessage', 'Please enter a Product ID', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/viewproduct/${productId}`);
    if (!response.ok) throw new Error('Product not found');

    const product = await response.json();
    currentUpdateProductId = product.id;

    document.getElementById('updateProductName').value = product.name;
    document.getElementById('updateProductDescription').value = product.description;
    document.getElementById('updateProductPrice').value = product.price;
    document.getElementById('updateProductQuantity').value = product.quantity;

    document.getElementById('updateProductForm').style.display = 'block';
    showMessage('updateMessage', '', 'success');
  } catch (error) {
    console.error('Error loading product:', error);
    showMessage('updateMessage', 'Product not found. Please check the Product ID.', 'error');
    document.getElementById('updateProductForm').style.display = 'none';
  }
}

async function handleUpdateProduct(e) {
  e.preventDefault();

  const productData = {
    id: currentUpdateProductId,
    name: document.getElementById('updateProductName').value.trim(),
    description: document.getElementById('updateProductDescription').value.trim(),
    price: parseFloat(document.getElementById('updateProductPrice').value),
    quantity: parseInt(document.getElementById('updateProductQuantity').value)
  };

  if (!validateProductData(productData)) {
    showMessage('updateMessage', 'Please fill all fields correctly', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/updateProduct`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });

    if (!response.ok) throw new Error('Failed to update product');

    const message = await response.text();
    showMessage('updateMessage', message, 'success');
    
    setTimeout(() => {
      loadAllProducts();
      cancelUpdate();
    }, 1500);
  } catch (error) {
    console.error('Error updating product:', error);
    showMessage('updateMessage', 'Error updating product. Please try again.', 'error');
  }
}

function cancelUpdate() {
  document.getElementById('updateProductForm').style.display = 'none';
  document.getElementById('updateProductId').value = '';
  document.getElementById('updateMessage').textContent = '';
  navigateToSection('update-product');
}

// Delete Product
function deleteProduct(productId) {
  selectedProductIdForDelete = productId;
  deleteModal.classList.add('show');
}

function closeDeleteModal() {
  deleteModal.classList.remove('show');
  selectedProductIdForDelete = null;
}

async function confirmDelete() {
  if (!selectedProductIdForDelete) return;

  try {
    const response = await fetch(`${API_BASE_URL}/deleteproduct/${selectedProductIdForDelete}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Failed to delete product');

    const message = await response.text();
    closeDeleteModal();
    
    // Show success in products section
    navigateToSection('products');
    loadAllProducts();
    
    // Show temporary message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message show success';
    messageDiv.textContent = message;
    productsContainer.insertBefore(messageDiv, productsContainer.firstChild);
    
    setTimeout(() => messageDiv.remove(), 3000);
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Error deleting product. Please try again.');
  }
}

// Logout
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    sessionStorage.removeItem('adminSession');
    localStorage.removeItem('adminToken');
    window.location.href = '/';
  }
}

// Stats
function updateStats() {
  totalProductsElement.textContent = allProducts.length;
}

// Utility Functions
function validateProductData(data) {
  return data.name && 
         data.description && 
         data.price > 0 && 
         data.quantity >= 0 &&
         !isNaN(data.price) &&
         !isNaN(data.quantity);
}

function showMessage(elementId, message, type) {
  const element = document.getElementById(elementId);
  if (!element) return;

  element.textContent = message;
  element.className = `message ${message ? 'show' : ''} ${type}`;

  if (message && type === 'success') {
    setTimeout(() => {
      element.textContent = '';
      element.className = 'message';
    }, 4000);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === deleteModal) {
    closeDeleteModal();
  }
});
