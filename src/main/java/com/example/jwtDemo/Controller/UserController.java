package com.example.jwtDemo.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

	  @GetMapping("/hello")
	    public String hello() {
	        return "Hello, public endpoint!";
	    }

	    @GetMapping("/customer/home")
	    public String customerHome() {
	        return "Welcome Customer!";
	    }

	    @GetMapping("/admin/home")
	    public String adminHome() {
	        return "Welcome Admin!";
	    }
}
