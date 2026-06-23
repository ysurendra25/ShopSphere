const productAlert = document.getElementById("productAlert");
const productForm = document.getElementById("productForm");
const productFormData = document.getElementById("productFormData");
const formTitle = document.getElementById("formTitle");
const productsContainer = document.getElementById("productsContainer");
const userInfo = document.getElementById("userInfo");
const logoutLink = document.getElementById("logoutLink");

const addProductBtn = document.getElementById("addProductBtn");
const refreshBtn = document.getElementById("refreshBtn");
const saveProductBtn = document.getElementById("saveProductBtn");
const cancelBtn = document.getElementById("cancelBtn");

const productId = document.getElementById("productId");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productDescription = document.getElementById("productDescription");
const productPhotoUrl = document.getElementById("productPhotoUrl");

const fieldErrors = {
  productName: document.getElementById("productNameError"),
  productPrice: document.getElementById("productPriceError"),
  productDescription: document.getElementById("productDescriptionError")
};

let sessionData = null;
let userRole = null;

function showAlert(message, isError) {
  productAlert.textContent = message;
  productAlert.classList.remove("success", "error");
  productAlert.classList.add(isError ? "error" : "success");
}

function clearAlert() {
  productAlert.textContent = "";
  productAlert.classList.remove("success", "error");
}

function clearFieldErrors() {
  Object.values(fieldErrors).forEach((el) => {
    el.textContent = "";
  });
}

function getAuthHeaders() {
  if (!sessionData || !sessionData.token) {
    return {};
  }
  return {
    "Authorization": `Bearer ${sessionData.token}`,
    "Content-Type": "application/json"
  };
}

function checkAuth() {
  const session = sessionStorage.getItem("jwtDemoSession");
  if (!session) {
    window.location.href = "/";
    return;
  }

  sessionData = JSON.parse(session);
  userInfo.textContent = sessionData.username || "User";

  // Role-based UI logic
  const userRole = sessionData.role;
  if (userRole === "ADMIN") {
    // Show admin controls
    addProductBtn.style.display = "inline-block";
    document.querySelectorAll(".edit-btn, .delete-btn").forEach(btn => {
      btn.style.display = "inline-block";
    });
  } else {
    // Hide admin controls for regular users
    addProductBtn.style.display = "none";
    document.querySelectorAll(".edit-btn, .delete-btn").forEach(btn => {
      btn.style.display = "none";
    });
  }
}

function logout() {
  sessionStorage.removeItem("jwtDemoSession");
  window.location.href = "/";
}

async function loadProducts() {
  try {
    const response = await fetch("/viewAllProduct", {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return;
      }
      throw new Error("Failed to load products");
    }

    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    showAlert("Failed to load products: " + error.message, true);
  }
}

function displayProducts(products) {
  productsContainer.innerHTML = "";

  if (products.length === 0) {
    productsContainer.innerHTML = "<p>No products found. Add your first product!</p>";
    return;
  }

  products.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
      <div class="product-info">
        <h4>${product.name}</h4>
        <p class="product-price">$${product.price}</p>
        <p>${product.description}</p>
        ${product.photoUrl ? `<img src="${product.photoUrl}" alt="${product.name}" style="max-width: 100px; max-height: 100px;">` : ""}
      </div>
      ${userRole === "ADMIN" ? `
      <div class="product-actions">
        <button class="primary-btn edit-btn" data-id="${product.id}">Edit</button>
        <button class="secondary-btn delete-btn" data-id="${product.id}">Delete</button>
      </div>
      ` : ""}
    `;

    productsContainer.appendChild(productCard);
  });

  // Add event listeners for edit and delete buttons
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", (e) => editProduct(e.target.dataset.id));
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => deleteProduct(e.target.dataset.id));
  });
}

function showProductForm(product = null) {
  clearFieldErrors();
  clearAlert();

  if (product) {
    formTitle.textContent = "Edit Product";
    productId.value = product.id;
    productName.value = product.name;
    productPrice.value = product.price;
    productDescription.value = product.description;
    productPhotoUrl.value = product.photoUrl || "";
    saveProductBtn.textContent = "Update";
  } else {
    formTitle.textContent = "Add Product";
    productFormData.reset();
    productId.value = "";
    saveProductBtn.textContent = "Save";
  }

  productForm.style.display = "block";
  productName.focus();
}

function hideProductForm() {
  productForm.style.display = "none";
  productFormData.reset();
  productId.value = "";
}

function validateProductForm() {
  let valid = true;
  clearFieldErrors();

  const name = productName.value.trim();
  const price = parseFloat(productPrice.value);
  const description = productDescription.value.trim();

  if (name.length < 2) {
    fieldErrors.productName.textContent = "Name should be at least 2 characters.";
    valid = false;
  }

  if (isNaN(price) || price <= 0) {
    fieldErrors.productPrice.textContent = "Price should be a positive number.";
    valid = false;
  }

  if (description.length < 5) {
    fieldErrors.productDescription.textContent = "Description should be at least 5 characters.";
    valid = false;
  }

  return valid;
}

async function saveProduct() {
  if (userRole !== "ADMIN") {
    showAlert("You don't have permission to modify products.", true);
    return;
  }

  if (!validateProductForm()) {
    return;
  }

  const productData = {
    id: productId.value || null,
    name: productName.value.trim(),
    price: parseFloat(productPrice.value),
    description: productDescription.value.trim(),
    photoUrl: productPhotoUrl.value.trim() || null
  };

  const isEdit = !!productId.value;
  const url = isEdit ? "/updateProduct" : "/addproducts";
  const method = isEdit ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: JSON.stringify(isEdit ? productData : { ...productData, id: undefined })
    });

    const result = await response.text();

    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return;
      }
      throw new Error(result || "Failed to save product");
    }

    showAlert(result, false);
    hideProductForm();
    loadProducts();
  } catch (error) {
    showAlert("Failed to save product: " + error.message, true);
  }
}

async function editProduct(id) {
  if (userRole !== "ADMIN") {
    showAlert("You don't have permission to edit products.", true);
    return;
  }

  try {
    const response = await fetch(`/viewproduct/${id}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return;
      }
      throw new Error("Failed to load product");
    }

    const product = await response.json();
    showProductForm(product);
  } catch (error) {
    showAlert("Failed to load product: " + error.message, true);
  }
}

async function deleteProduct(id) {
  if (userRole !== "ADMIN") {
    showAlert("You don't have permission to delete products.", true);
    return;
  }

  if (!confirm("Are you sure you want to delete this product?")) {
    return;
  }

  try {
    const response = await fetch(`/deleteproduct/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    const result = await response.text();

    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return;
      }
      throw new Error(result || "Failed to delete product");
    }

    showAlert(result, false);
    loadProducts();
  } catch (error) {
    showAlert("Failed to delete product: " + error.message, true);
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  loadProducts();
});

logoutLink.addEventListener("click", logout);
addProductBtn.addEventListener("click", () => {
  if (userRole !== "ADMIN") {
    showAlert("You don't have permission to add products.", true);
    return;
  }
  showProductForm();
});
refreshBtn.addEventListener("click", loadProducts);
cancelBtn.addEventListener("click", hideProductForm);

productFormData.addEventListener("submit", async (e) => {
  e.preventDefault();
  await saveProduct();
});