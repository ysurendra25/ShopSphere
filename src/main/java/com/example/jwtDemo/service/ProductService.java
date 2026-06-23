package com.example.jwtDemo.service;

import java.util.*;
import java.util.List;
import java.util.Optional;

import com.example.jwtDemo.dto.ProductDTO;
import com.example.jwtDemo.entity.Product;

public interface ProductService {
      public String addProduct(ProductDTO pdto);
      public String updateProduct(Product pm);
      public String deleteProduct(Long pid);
      public Optional<Product> viewProduct(Long pid);
      List<Product> viewAllProducts();
      
}