package me.hellonayeon.backend.attendance.controller;

import java.util.Date;
import java.util.List;
import me.hellonayeon.backend.attendance.domain.Attendance;
import me.hellonayeon.backend.attendance.exception.AttendanceException;
import me.hellonayeon.backend.attendance.service.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    private final AttendanceService service;

    public AttendanceController(AttendanceService service) {
        this.service = service;
    }

    @GetMapping("/today")
    public ResponseEntity<Attendance> getTodayAttendance(
            Authentication authentication
    ) {
        System.out.println("AttendanceController getTodayAttendance " + new Date());

        String memberId = authentication.getName();
        return ResponseEntity.ok(service.getTodayAttendance(memberId));
    }

    @PostMapping("/start")
    public ResponseEntity<Attendance> startAttendance(
            Authentication authentication
    ) {
        System.out.println("AttendanceController startAttendance " + new Date());

        String memberId = authentication.getName();
        return ResponseEntity.ok(service.startAttendance(memberId));
    }

    @PostMapping("/end")
    public ResponseEntity<Attendance> endAttendance(
            Authentication authentication
    ) {
        System.out.println("AttendanceController endAttendance " + new Date());

        String memberId = authentication.getName();
        return ResponseEntity.ok(service.endAttendance(memberId));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Attendance>> getAttendanceHistory(
            Authentication authentication
    ) {
        System.out.println("AttendanceController getAttendanceHistory " + new Date());

        String memberId = authentication.getName();
        return ResponseEntity.ok(service.getAttendanceHistory(memberId));
    }

    @ExceptionHandler(AttendanceException.class)
    public ResponseEntity<?> handleAttendanceException(
            AttendanceException e
    ) {
        return new ResponseEntity<>(e.getMessage(), e.getStatus());
    }
}