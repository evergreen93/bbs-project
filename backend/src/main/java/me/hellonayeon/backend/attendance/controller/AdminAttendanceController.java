package me.hellonayeon.backend.attendance.controller;

import me.hellonayeon.backend.attendance.domain.Attendance;
import me.hellonayeon.backend.attendance.dto.AttendanceSummary;
import me.hellonayeon.backend.attendance.dto.AttendanceUpdateRequest;
import me.hellonayeon.backend.attendance.service.AttendanceService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

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

    @GetMapping
    public ResponseEntity<List<Attendance>>
    getAttendanceList(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        LocalDate targetDate =
                date != null ? date : LocalDate.now();

        return ResponseEntity.ok(
                service.getAttendanceList(targetDate)
        );
    }

    @PutMapping("/{memberId}")
    public ResponseEntity<Void> updateAttendance(
            @PathVariable String memberId,
            @RequestBody AttendanceUpdateRequest request
    ) {
        service.updateAttendance(memberId, request);

        return ResponseEntity.noContent().build();
    }

}