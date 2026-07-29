package me.hellonayeon.backend.attendance.dao;

import java.time.LocalDate;
import java.util.List;
import me.hellonayeon.backend.attendance.domain.Attendance;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
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

    List<Attendance> getAttendanceList(LocalDate date);

    Attendance findByMemberIdAndWorkDate(
            @Param("memberId") String memberId,
            @Param("workDate") LocalDate workDate
    );

    Integer insertAttendance(Attendance attendance);

    Integer updateAttendance(Attendance attendance);

}