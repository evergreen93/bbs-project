package me.hellonayeon.backend.attendance.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import me.hellonayeon.backend.attendance.dao.AttendanceDao;
import me.hellonayeon.backend.attendance.domain.Attendance;
import me.hellonayeon.backend.attendance.dto.AttendanceSummary;
import me.hellonayeon.backend.attendance.dto.AttendanceUpdateRequest;
import me.hellonayeon.backend.attendance.exception.AttendanceException;
import me.hellonayeon.backend.vacation.dao.VacationDao;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AttendanceService {

    private final AttendanceDao dao;
    private final VacationDao vacationDao;

    public AttendanceService(
            AttendanceDao dao,
            VacationDao vacationDao
    ) {
        this.dao = dao;
        this.vacationDao = vacationDao;
    }

    public Attendance getTodayAttendance(String memberId) {
        return dao.findTodayByMemberId(memberId);
    }

    public Attendance startAttendance(String memberId) {

        boolean isVacation =
                vacationDao.existsApprovedVacationToday(memberId);

        if (isVacation) {
            throw new AttendanceException(
                    "휴가 중에는 출근할 수 없습니다.",
                    HttpStatus.BAD_REQUEST
            );
        }

        Attendance attendance =
                dao.findTodayByMemberId(memberId);

        if (attendance != null) {
            throw new AttendanceException(
                    "이미 오늘 출근 처리되었습니다.",
                    HttpStatus.BAD_REQUEST
            );
        }

        Integer result = dao.startAttendance(memberId);

        if (result == null || result == 0) {
            throw new AttendanceException(
                    "출근 처리에 실패했습니다.",
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        return dao.findTodayByMemberId(memberId);
    }

    public Attendance endAttendance(String memberId) {
        Attendance attendance =
                dao.findTodayByMemberId(memberId);

        if (attendance == null) {
            throw new AttendanceException(
                    "출근 처리 후 퇴근할 수 있습니다.",
                    HttpStatus.BAD_REQUEST
            );
        }

        if (attendance.getEndTime() != null) {
            throw new AttendanceException(
                    "이미 오늘 퇴근 처리되었습니다.",
                    HttpStatus.BAD_REQUEST
            );
        }

        Integer result = dao.endAttendance(memberId);

        if (result == null || result == 0) {
            throw new AttendanceException(
                    "퇴근 처리에 실패했습니다.",
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        return dao.findTodayByMemberId(memberId);
    }

    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceHistory(
            String memberId
    ) {
        return dao.findHistoryByMemberId(memberId);
    }

    @Transactional(readOnly = true)
    public AttendanceSummary getTodayAttendanceSummary() {
        AttendanceSummary summary =
                dao.getTodayAttendanceSummary();

        if (summary == null) {
            return new AttendanceSummary();
        }

        return summary;
    }

    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceList(
            LocalDate date
    ) {
        return dao.getAttendanceList(date);
    }

    public void updateAttendance(
            String memberId,
            AttendanceUpdateRequest request
    ) {

        if (request.getWorkDate() == null) {
            throw new AttendanceException(
                    "근태 날짜가 필요합니다.",
                    HttpStatus.BAD_REQUEST
            );
        }

        String status = request.getStatus();

        if (status == null || status.isBlank()) {
            throw new AttendanceException(
                    "근태 상태가 필요합니다.",
                    HttpStatus.BAD_REQUEST
            );
        }

        // 미출근이면 해당 날짜의 근태 기록 삭제
        if ("ABSENT".equals(status)) {
            dao.deleteAttendance(
                    memberId,
                    request.getWorkDate()
            );
            return;
        }

        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;

        if (request.getStartTime() != null) {
            startDateTime = LocalDateTime.of(
                    request.getWorkDate(),
                    request.getStartTime()
            );
        }

        if (request.getEndTime() != null) {
            endDateTime = LocalDateTime.of(
                    request.getWorkDate(),
                    request.getEndTime()
            );
        }

        if (
                startDateTime != null
                        && endDateTime != null
                        && endDateTime.isBefore(startDateTime)
        ) {
            throw new AttendanceException(
                    "퇴근 시간은 출근 시간보다 빠를 수 없습니다.",
                    HttpStatus.BAD_REQUEST
            );
        }

        Attendance attendance = new Attendance();

        attendance.setMemberId(memberId);
        attendance.setWorkDate(request.getWorkDate());
        attendance.setStatus(status);
        attendance.setStartTime(startDateTime);
        attendance.setEndTime(endDateTime);

        Attendance existingAttendance =
                dao.findByMemberIdAndWorkDate(
                        memberId,
                        request.getWorkDate()
                );

        Integer result;

        if (existingAttendance == null) {
            result = dao.insertAttendance(attendance);
        } else {
            result = dao.updateAttendance(attendance);
        }

        if (result == null || result == 0) {
            throw new AttendanceException(
                    "근태 정보 저장에 실패했습니다.",
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}