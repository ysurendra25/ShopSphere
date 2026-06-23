package com.example.jwtDemo.service;

import java.util.*;
import java.util.List;
import org.springframework.stereotype.Service;

import com.example.jwtDemo.dto.ProductDTO;
import com.example.jwtDemo.entity.Product;
import com.example.jwtDemo.repository.ProductRepository;

@Service
public class ProductServiceImplementation implements ProductService{

	
	ProductRepository prepo;
	public ProductServiceImplementation(ProductRepository prepo) {
		this.prepo = prepo;
	}
	
	
	public String addProduct(ProductDTO pdto) {
		Product pm = new Product();
		pm.setName(pdto.getName());
		pm.setPrice(pdto.getPrice());
		pm.setDescription(pdto.getDescription());
		pm.setQuantity(pdto.getQuantity());
		pm.setPhotoUrl(pdto.getPhotoUrl());
		prepo.save(pm);
		return "added product successfully";
	}

	@Override
	public String updateProduct(Product pm) {
		if (pm.getId() == null || !prepo.existsById(pm.getId())) {
			throw new IllegalArgumentException("Product not found for update.");
		}
		prepo.save(pm);
		return "Product updated successfully.";
	}

	@Override
	public String deleteProduct(Long pid) {
		if (!prepo.existsById(pid)) {
			throw new IllegalArgumentException("Product not found for delete.");
		}
		prepo.deleteById(pid);
		return "Product deleted successfully.";
	}

	@Override
	public Optional<Product> viewProduct(Long pid) {
		return prepo.findById(pid);
	}


	@Override
	public List<Product> viewAllProducts() {
		return prepo.findAll();
	}
}