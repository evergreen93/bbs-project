package me.hellonayeon.backend.vacation.dao;

import java.util.List;
import me.hellonayeon.backend.vacation.domain.Vacation;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface VacationDao {
    Integer countTodayVacation();

    Integer createVacation(Vacation vacation);

    List<Vacation> findByMemberId(@Param("memberId") String memberId);

    Integer countPendingVacations();

    List<Vacation> findPendingVacations();

    Integer approveVacation(Integer vacationId);

    Integer rejectVacation(Integer vacationId);

    Vacation findByVacationId(Integer vacationId);

}