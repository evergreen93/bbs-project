package me.hellonayeon.backend.vacation.controller;

import java.util.List;
import java.util.Map;

import me.hellonayeon.backend.vacation.domain.Vacation;
import me.hellonayeon.backend.vacation.service.VacationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/vacation")
public class VacationController {

    private final VacationService service;

    public VacationController(VacationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Vacation> createVacation(
            Authentication authentication,
            @RequestBody Vacation vacation
    ) {
        String memberId = authentication.getName();

        return ResponseEntity.ok(
                service.createVacation(memberId, vacation)
        );
    }

    @GetMapping
    public ResponseEntity<List<Vacation>> getMyVacations(
            Authentication authentication
    ) {
        String memberId = authentication.getName();

        return ResponseEntity.ok(
                service.getMyVacations(memberId)
        );
    }

    @GetMapping("/today/count")
    public ResponseEntity<Integer> getTodayVacationCount() {
        return ResponseEntity.ok(
                service.getTodayVacationCount()
        );
    }

    @GetMapping("/remaining")
    public ResponseEntity<Double> getRemainingVacationDays(
            Authentication authentication
    ) {
        String memberId = authentication.getName();

        return ResponseEntity.ok(
                service.getRemainingVacationDays(memberId)
        );
    }

    @GetMapping("/today")
    public ResponseEntity<Map<String, Boolean>> getTodayVacation(
            Authentication authentication
    ) {
        String memberId = authentication.getName();

        return ResponseEntity.ok(
                Map.of(
                        "isVacation",
                        service.isTodayVacation(memberId)
                )
        );
    }

}