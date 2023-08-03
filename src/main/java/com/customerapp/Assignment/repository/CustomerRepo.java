package com.customerapp.Assignment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.customerapp.Assignment.model.Customer;
@Repository
public interface CustomerRepo extends JpaRepository<Customer, Long> {

}
