package me.hellonayeon.backend.attendance.controller;

import me.hellonayeon.backend.attendance.dto.AttendanceSummary;
import me.hellonayeon.backend.attendance.service.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/attendance")
public class AdminAttendanceController {

    private final AttendanceService service;

    public AdminAttendanceController(
            AttendanceService service
    ) {
        this.service = service;
    }

    @GetMapping("/today/summary")
    public ResponseEntity<AttendanceSummary>
    getTodayAttendanceSummary() {

        return ResponseEntity.ok(
                service.getTodayAttendanceSummary()
        );
    }
}