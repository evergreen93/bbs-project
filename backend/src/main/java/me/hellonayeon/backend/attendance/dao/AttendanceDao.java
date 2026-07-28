package me.hellonayeon.backend.attendance.dao;

import java.util.List;
import me.hellonayeon.backend.attendance.domain.Attendance;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import me.hellonayeon.backend.attendance.dto.AttendanceSummary;

@Mapper
@Repository
public interface AttendanceDao {

    Attendance findTodayByMemberId(String memberId);

    Integer startAttendance(String memberId);

    Integer endAttendance(String memberId);

    List<Attendance> findHistoryByMemberId(String memberId);

    AttendanceSummary getTodayAttendanceSummary();
}