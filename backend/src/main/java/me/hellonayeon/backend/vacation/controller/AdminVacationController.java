package me.hellonayeon.backend.vacation.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import me.hellonayeon.backend.vacation.domain.Vacation;
import me.hellonayeon.backend.vacation.service.VacationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/vacations")
public class AdminVacationController {

    private final VacationService service;

    public AdminVacationController(VacationService service) {
        this.service = service;
    }

    @GetMapping("/pending/count")
    public ResponseEntity<Integer> getPendingVacationCount() {
        return ResponseEntity.ok(
                service.getPendingVacationCount()
        );
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Vacation>> getPendingVacations() {
        return ResponseEntity.ok(
                service.getPendingVacations()
        );
    }
    @PostMapping("/{vacationId}/approve")
    public ResponseEntity<?> approveVacation(
            @PathVariable Integer vacationId
    ) {
        service.approveVacation(vacationId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{vacationId}/reject")
    public ResponseEntity<?> rejectVacation(
            @PathVariable Integer vacationId
    ) {
        service.rejectVacation(vacationId);
        return ResponseEntity.ok().build();
    }



}