
package com.customerapp.Assignment.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.customerapp.Assignment.model.User;


@CrossOrigin("*")
@RestController
public class LoginController {

	@PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        String storedUsername = "user1"; 
        String storedPassword = "password1"; 

        if (storedUsername.equals(user.getUserName()) && storedPassword.equals(user.getPassword())) {
            return ResponseEntity.ok("/customer"); 
        } else {
            return ResponseEntity.badRequest().body("Invalid credentials"); 
        }
    }
   
}
