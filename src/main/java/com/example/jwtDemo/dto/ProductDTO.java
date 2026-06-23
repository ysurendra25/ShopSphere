package com.example.jwtDemo.dto;

public class ProductDTO {
	private Long id;
	private String name;
	private double price;       // changed from int → double for decimal prices
	private String description;
	private int quantity;       // added: was missing, frontend sends this field
	private String photoUrl;

	public ProductDTO() {}

	public ProductDTO(Long id, String name, double price, String description, int quantity, String photoUrl) {
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
		return "ProductDTO [id=" + id + ", name=" + name + ", price=" + price
				+ ", description=" + description + ", quantity=" + quantity + ", photoUrl=" + photoUrl + "]";
	}
}