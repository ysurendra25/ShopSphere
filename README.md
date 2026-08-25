# ShopSphere — Secure E-Commerce Web Application

A full-stack e-commerce application built with Java, Spring Boot, Spring Security (JWT), MySQL, and a custom HTML/CSS/JavaScript frontend.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Language | Java, JavaScript |
| Backend | Spring Boot, Spring MVC, Spring Security |
| Auth | JWT (JSON Web Tokens) |
| Persistence | Spring Data JPA, Hibernate |
| Database | MySQL |
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Build | Maven |
| Testing | Postman |
| Version Control | Git, GitHub |

## Features

### Authentication & Authorization
- **JWT-based authentication** — Secure login/register with token-based auth using Spring Security
- **Role-Based Access Control** — Separate admin and customer roles with differentiated permissions

### Admin Dashboard
- Add, edit, and delete products
- Manage product catalog
- View and manage customer orders
- Admin-only access control

### Customer Dashboard
- Browse product catalog
- Add products to cart
- Place orders
- View order history

### Product Management
- Product listing page with details (name, price, description, image)
- CRUD operations via REST APIs
- Search and filter products

### Cart & Order Management
- Add to cart, update quantity, remove items
- Place orders with automatic order total calculation
- View order history and order status

## Frontend Pages

| Page | File | Description |
|------|------|-------------|
| Login / Landing | `index.html`, `login.js` | User login & registration with JWT |
| Admin Dashboard | `admin-dashboard.html`, `admin.js` | Admin panel for product & order management |
| Customer Dashboard | `customer-dashboard.html`, `customer.js` | Customer shopping interface |
| Products | `products.html`, `products.js` | Product browsing and listing |
| Styling | `styles.css` | Full CSS styling

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login, returns JWT token |
| GET | `/api/products` | List all products |
| GET | `/api/products/{id}` | Get product by ID |
| POST | `/api/products` | Add new product (Admin) |
| PUT | `/api/products/{id}` | Update product (Admin) |
| DELETE | `/api/products/{id}` | Delete product (Admin) |
| POST | `/api/cart/add` | Add product to cart |
| GET | `/api/cart` | View user's cart |
| DELETE | `/api/cart/{itemId}` | Remove item from cart |
| POST | `/api/orders` | Place an order |
| GET | `/api/orders` | View order history |

## Project Structure

```
ShopSphere/
├── src/main/java/com/example/
│   ├── config/              # Security & JWT configuration
│   ├── controller/          # REST API controllers
│   ├── model/               # Entity classes (Product, Cart, Order, User)
│   ├── repository/          # Spring Data JPA repositories
│   ├── service/             # Business logic layer
│   └── security/            # JWT filter & auth logic
├── src/main/resources/
│   ├── static/              # Frontend files
│   │   ├── index.html        # Login / landing page
│   │   ├── admin-dashboard.html
│   │   ├── customer-dashboard.html
│   │   ├── products.html
│   │   ├── admin.js          # Admin dashboard logic
│   │   ├── customer.js       # Customer shopping logic
│   │   ├── products.js       # Product listing logic
│   │   ├── login.js          # JWT login/register logic
│   │   ├── app.js            # Main app logic
│   │   ├── styles.css        # Full CSS styling
│   │   └── images/           # Product images
│   └── application.properties # MySQL config
├── pom.xml                   # Maven dependencies
└── mvnw                      # Maven wrapper
```

## Author

**Yerrappa Surendra**
- Email: ysm69242@gmail.com
- LinkedIn: [y-surendra-6827542bb](https://linkedin.com/in/y-surendra-6827542bb)
- GitHub: [ysurendra25](https://github.com/ysurendra25)
