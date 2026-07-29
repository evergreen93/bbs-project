package me.hellonayeon.backend.attendance.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class AttendanceUpdateRequest {

    private LocalDate workDate;
    private String status;
    private LocalTime startTime;
    private LocalTime endTime;

    public AttendanceUpdateRequest() {
    }

    public LocalDate getWorkDate() {
        return workDate;
    }

    public void setWorkDate(LocalDate workDate) {
        this.workDate = workDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
}