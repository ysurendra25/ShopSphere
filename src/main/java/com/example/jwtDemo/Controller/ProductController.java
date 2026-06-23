package com.example.jwtDemo.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.jwtDemo.dto.ProductDTO;
import com.example.jwtDemo.entity.Product;
import com.example.jwtDemo.service.ProductService;

@RestController
@CrossOrigin(origins = "*") 
public class ProductController {
    
	ProductService pservice;
	public ProductController(ProductService pservice) {
		this.pservice = pservice;
	}
	

	@PostMapping("/addproducts")
	public String addProduct(@RequestBody ProductDTO pdto) {
		return pservice.addProduct(pdto);
	}
	
	@PutMapping("/updateProduct")
	public String updateProduct(@RequestBody Product product) {
		return pservice.updateProduct(product);
	} 
	@DeleteMapping("/deleteproduct/{pid}")
	public String deleteProduct(@PathVariable Long pid) {
		return pservice.deleteProduct(pid);
	}
	@GetMapping("/viewproduct/{pid}")
	public ResponseEntity<Product> viewProduct(@PathVariable Long pid) {
		return pservice.viewProduct(pid)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}
	@GetMapping("/viewAllProduct")
	public List<Product> viewAllProduct() {
		return pservice.viewAllProducts();
	}
}