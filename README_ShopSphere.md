# ShopSphere - Secure E-commerce Backend | JWT Demo
### finalbuildapp / jwtDemo

A secure, scalable e-commerce REST API backend built with Java, Spring Boot, Spring Security (JWT), and MySQL. This repository contains the authentication and core e-commerce modules (Product, Cart, Order) developed as part of Kodnest Java Full Stack Internship.

**Live Demo:** Deploying on Railway - WIP (link will be updated)
**Author:** Yerrappa Surendra | [LinkedIn](https://www.linkedin.com/in/y-surendra-6827542bb/) | [Portfolio GitHub](https://github.com/ysurendra25)

---

## Tech Stack
**Backend:** Java, Spring Boot, Spring MVC, Spring Security, Spring Data JPA, Hibernate
**Security:** JWT (JSON Web Token) Authentication & Authorization
**Database:** MySQL, Relational Design
**Build & Tools:** Maven, Git, GitHub, Postman, Railway (Deploying)
**Frontend Integration:** React.js (WIP - PlanYourDay + ShopSphere UI)

---

## Features Implemented
- JWT-based Authentication and Authorization with Spring Security
- User Registration and Login with encrypted password storage
- Protected REST APIs with role-based access
- Product Management - CRUD APIs for product listing and search
- Shopping Cart Management - Add, update, remove items
- Order Management - Place order, view orders
- MySQL integration with Spring Data JPA / Hibernate for persistence
- Exception Handling and validation
- Tested with Postman, version controlled with Git

## Security Flow
1. User registers / logs in via `/api/auth/**`
2. Server validates credentials and generates JWT token
3. Client stores token and sends in `Authorization: Bearer <token>` header
4. Spring Security filter validates token for protected endpoints
5. Token expiry handling and secure session management

## Database Design
**Entities:**
- User (id, username, email, password, roles)
- Product (id, name, description, price, stock, category)
- Cart / CartItem (user mapping, product, quantity)
- Order / OrderItem (order history)

Relationship: User -> Cart -> CartItems -> Product, User -> Orders

## API Endpoints

### Auth
```
POST /api/auth/register - Register new user
POST /api/auth/login - Login and get JWT token
```

### Product
```
GET /api/products - List all products
GET /api/products/{id} - Get product by ID
POST /api/products - Add product (Protected)
PUT /api/products/{id} - Update product (Protected)
```

### Cart
```
GET /api/cart - Get user cart
POST /api/cart/add - Add item to cart
DELETE /api/cart/remove/{productId} - Remove item
```

### Order
```
POST /api/orders/place - Place order
GET /api/orders/my - Get my orders
```

*Note: 10+ REST APIs implemented, full list available in Postman collection*

## How to Run Locally

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.0+

### Steps
1. Clone the repo
```bash
git clone https://github.com/ysurendra25/finalbuildapp.git
cd finalbuildapp/jwtDemo
```

2. Configure MySQL in `src/main/resources/application.properties`
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/shopsphere_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
jwt.secret=your_jwt_secret_key
jwt.expiration=86400000
```

3. Build and run
```bash
mvn clean install
mvn spring-boot:run
```

4. App runs at `http://localhost:8080`

## Postman Testing
1. Import collection (create one if not yet)
2. Register: POST `http://localhost:8080/api/auth/register`
3. Login: POST `http://localhost:8080/api/auth/login` -> copy token
4. Use token in Authorization header for protected APIs: `Bearer <your_token>`

## DSA Practice
This GitHub also contains my DSA practice: [DSADailyPractisePrograms](https://github.com/ysurendra25/DSADailyPractisePrograms)
- 100+ problems in Java: Arrays, Strings, Linked Lists, Stacks, Queues, Trees, Graphs, DP

## Current Work
- Containerizing app for Railway deployment
- Adding JUnit tests for service layer
- Integrating React frontend for ShopSphere UI
- Adding Swagger/OpenAPI documentation

## Future Enhancements
- Microservices split (User, Product, Order services)
- Docker + CI/CD
- Payment gateway integration
- Redis caching for product listing

## Relevant Coursework & Certifications
- B.E. CSE (JNTUA) - OOPs, DSA, DBMS, OS, CN
- Kodnest - Java Full Stack Development
- Rooman Technologies - Data Analyst (Power BI)

## Contact
Yerrappa Surendra - ysm69242@gmail.com - +91 9949466412
