package com.example.jwtDemo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiTester {
    @GetMapping("/test")
    public String apiTest() {
    	    return "api is ready, ready to run";
    }
}