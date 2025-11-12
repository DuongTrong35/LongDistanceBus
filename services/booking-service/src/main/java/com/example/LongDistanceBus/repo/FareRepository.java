package com.example.LongDistanceBus.repo;

import com.example.LongDistanceBus.domain.Fare;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FareRepository extends JpaRepository<Fare, Long> {

    List<Fare> findByRoute_Id(Long routeId);

    List<Fare> findByRoute_IdAndOperator_Id(Long routeId, Long operatorId);

    List<Fare> findByOperator_Id(Long operatorId);

    Optional<Fare> findFirstByRoute_IdAndSeatType_IdAndOperator_Id(Long routeId, Long seatTypeId, Long operatorId);

    Optional<Fare> findFirstByRoute_IdAndSeatType_IdAndOperatorIsNull(Long routeId, Long seatTypeId);
}

