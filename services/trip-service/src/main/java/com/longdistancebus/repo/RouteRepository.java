package com.longdistancebus.repo;

import com.longdistancebus.domain.Route;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RouteRepository extends JpaRepository<Route, String> {

}
