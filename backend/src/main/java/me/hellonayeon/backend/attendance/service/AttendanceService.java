package me.hellonayeon.backend.attendance.service;

import java.util.List;
import me.hellonayeon.backend.attendance.dao.AttendanceDao;
import me.hellonayeon.backend.attendance.domain.Attendance;
import me.hellonayeon.backend.attendance.exception.AttendanceException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import me.hellonayeon.backend.attendance.dto.AttendanceSummary;

@Service
@Transactional
public class AttendanceService {

    private final AttendanceDao dao;

    public AttendanceService(AttendanceDao dao) {
        this.dao = dao;
    }

    public Attendance getTodayAttendance(String memberId) {
        return dao.findTodayByMemberId(memberId);
    }

    public Attendance startAttendance(String memberId) {
        Attendance attendance = dao.findTodayByMemberId(memberId);

        if (attendance != null) {
            throw new AttendanceException(
                    "이미 오늘 출근 처리되었습니다.",
                    HttpStatus.BAD_REQUEST
            );
        }

        Integer result = dao.startAttendance(memberId);

        if (result == 0) {
            throw new AttendanceException(
                    "출근 처리에 실패했습니다.",
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        return dao.findTodayByMemberId(memberId);
    }

    public Attendance endAttendance(String memberId) {
        Attendance attendance = dao.findTodayByMemberId(memberId);

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

        if (result == 0) {
            throw new AttendanceException(
                    "퇴근 처리에 실패했습니다.",
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        return dao.findTodayByMemberId(memberId);
    }

    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceHistory(String memberId) {
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

}