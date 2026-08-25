# ShopSphere — Secure E-Commerce Backend

A secure e-commerce backend built with Java and Spring Boot, featuring JWT-based authentication and RESTful APIs for product, cart, and order management.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Language | Java |
| Framework | Spring Boot, Spring MVC, Spring Security |
| Auth | JWT (JSON Web Tokens) |
| Persistence | Spring Data JPA, Hibernate |
| Database | MySQL |
| Build | Maven |
| Testing | Postman |
| Version Control | Git, GitHub |

## Features

- **JWT Authentication & Authorization** — Secure login/register with token-based auth using Spring Security
- **Product Management** — CRUD APIs for product catalog (list, add, update, delete)
- **Cart Management** — Add to cart, update quantity, remove items
- **Order Management** — Place orders, view order history, order status
- **Role-Based Access Control** — Admin and customer roles with differentiated permissions
- **REST API Design** — 10+ RESTful endpoints tested via Postman

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
├── src/main/java/
│   ├── config/          # Security & JWT configuration
│   ├── controller/      # REST API controllers
│   ├── model/           # Entity classes (Product, Cart, Order, User)
│   ├── repository/      # Spring Data JPA repositories
│   ├── service/         # Business logic layer
│   └── security/        # JWT filter & auth logic
├── src/main/resources/
│   └── application.properties  # MySQL config
├── pom.xml              # Maven dependencies
└── mvnw                 # Maven wrapper
```

## How to Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/ysurendra25/ShopSphere.git
   cd ShopSphere
   ```

2. **Configure MySQL** — Update `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/shopsphere
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```

3. **Build and run**
   ```bash
   ./mvnw spring-boot:run
   ```

4. **Test the APIs** — Import the endpoints into Postman and start testing

## Status

Currently containerizing for Railway deployment. Frontend (React) is work in progress.

## Author

**Yerrappa Surendra**
- Email: ysm69242@gmail.com
- LinkedIn: [y-surendra-6827542bb](https://linkedin.com/in/y-surendra-6827542bb)
- GitHub: [ysurendra25](https://github.com/ysurendra25)
