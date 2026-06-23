package com.example.jwtDemo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	// Use double so decimal prices (e.g. 99.99) are stored correctly
	@Column(nullable = false)
	private double price;

	@Column(length = 1000)
	private String description;

	// quantity of stock available
	@Column(nullable = false, columnDefinition = "INT DEFAULT 0")
	private int quantity;

	@Column(name = "photo_url")
	private String photoUrl;

	public Product() {
	}

	public Product(Long id, String name, double price, String description, int quantity, String photoUrl) {
		this.id = id;
		this.name = name;
		this.price = price;
		this.description = description;
		this.quantity = quantity;
		this.photoUrl = photoUrl;
	}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public String getName() { return name; }
	public void setName(String name) { this.name = name; }

	public double getPrice() { return price; }
	public void setPrice(double price) { this.price = price; }

	public String getDescription() { return description; }
	public void setDescription(String description) { this.description = description; }

	public int getQuantity() { return quantity; }
	public void setQuantity(int quantity) { this.quantity = quantity; }

	public String getPhotoUrl() { return photoUrl; }
	public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

	@Override
	public String toString() {
		return "Product [id=" + id + ", name=" + name + ", price=" + price
				+ ", description=" + description + ", quantity=" + quantity + ", photoUrl=" + photoUrl + "]";
	}
}