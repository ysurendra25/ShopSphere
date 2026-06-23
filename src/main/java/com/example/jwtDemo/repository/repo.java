package com.example.jwtDemo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.jwtDemo.entity.Users;

public interface repo extends JpaRepository<Users, Long>{

	   Optional<Users> findByUsername(String username);

	    boolean existsByUsername(String username);
}
