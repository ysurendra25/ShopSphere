package com.example.jwtDemo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.jwtDemo.entity.Users;

@Repository
public interface UserRepo extends JpaRepository<Users, Long>{

	 Optional<Users> findByUsername(String username);

	    boolean existsByUsername(String username);
}
