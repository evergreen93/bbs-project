package me.hellonayeon.backend.vacation.service;

import java.time.LocalDate;
import java.util.List;

import me.hellonayeon.backend.member.dao.MemberDao;
import me.hellonayeon.backend.vacation.dao.VacationDao;
import me.hellonayeon.backend.vacation.domain.Vacation;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.DayOfWeek;
import java.time.temporal.ChronoUnit;

@Service
@Transactional
public class VacationService {

    private final VacationDao dao;

    public VacationService(VacationDao dao) {
        this.dao = dao;
    }

    public Vacation createVacation(String memberId, Vacation vacation) {

        if (vacation.getStartDate() == null || vacation.getEndDate() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "휴가 시작일과 종료일을 입력해주세요."
            );
        }

        if (vacation.getStartDate().isBefore(LocalDate.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "지난 날짜로는 휴가를 신청할 수 없습니다."
            );
        }

        if (vacation.getEndDate().isBefore(vacation.getStartDate())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "종료일은 시작일보다 빠를 수 없습니다."
            );
        }

        double requestedDays = calculateVacationDays(vacation);
        double usedDays = calculateUsedVacationDays(memberId);
        double totalDays = 15.0;
        double remainingDays = totalDays - usedDays;

        if (requestedDays > remainingDays) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "남은 연차가 부족합니다. 현재 잔여 연차는 "
                            + remainingDays + "일입니다."
            );
        }

        vacation.setMemberId(memberId);

        Integer result = dao.createVacation(vacation);

        if (result == 0) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "휴가 신청에 실패했습니다."
            );
        }

        return vacation;
    }

    @Transactional(readOnly = true)
    public int getTodayVacationCount() {
        return dao.countTodayVacation();
    }

    @Transactional(readOnly = true)
    public List<Vacation> getMyVacations(String memberId) {
        return dao.findByMemberId(memberId);
    }

    private double calculateUsedVacationDays(String memberId) {
        List<Vacation> vacations = dao.findByMemberId(memberId);

        return vacations.stream()
                .filter(vacation -> "승인".equals(vacation.getStatus()))
                .mapToDouble(this::calculateVacationDays)
                .sum();
    }

    private double calculateVacationDays(Vacation vacation) {
        String type = vacation.getVacationType();

        if ("병가".equals(type) || "기타".equals(type)) {
            return 0.0;
        }

        if ("오전 반차".equals(type) || "오후 반차".equals(type)) {
            if (!vacation.getStartDate().equals(vacation.getEndDate())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "반차는 하루만 신청할 수 있습니다."
                );
            }

            if (isWeekend(vacation.getStartDate())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "주말에는 반차를 신청할 수 없습니다."
                );
            }

            return 0.5;
        }

        if ("연차".equals(type)) {
            return countWeekdays(
                    vacation.getStartDate(),
                    vacation.getEndDate()
            );
        }

        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "올바르지 않은 휴가 종류입니다."
        );
    }

    private double countWeekdays(LocalDate startDate, LocalDate endDate) {
        long days = ChronoUnit.DAYS.between(startDate, endDate) + 1;

        double count = 0.0;

        for (long i = 0; i < days; i++) {
            LocalDate date = startDate.plusDays(i);

            if (!isWeekend(date)) {
                count++;
            }
        }

        if (count == 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "연차는 평일에만 신청할 수 있습니다."
            );
        }

        return count;
    }

    private boolean isWeekend(LocalDate date) {
        DayOfWeek day = date.getDayOfWeek();

        return day == DayOfWeek.SATURDAY
                || day == DayOfWeek.SUNDAY;
    }

    @Transactional(readOnly = true)
    public double getRemainingVacationDays(String memberId) {
        double totalDays = 15.0;
        double usedDays = calculateUsedVacationDays(memberId);

        return Math.max(0.0, totalDays - usedDays);
    }

    @Transactional(readOnly = true)
    public int getPendingVacationCount() {
        Integer count = dao.countPendingVacations();
        return count == null ? 0 : count;
    }

    @Transactional(readOnly = true)
    public List<Vacation> getPendingVacations() {
        return dao.findPendingVacations();
    }

    public void approveVacation(Integer vacationId) {

        Vacation vacation = dao.findByVacationId(vacationId);

        if (vacation == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "휴가 신청 내역을 찾을 수 없습니다."
            );
        }

        if (!"대기".equals(vacation.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "이미 처리된 휴가 신청입니다."
            );
        }

        double requestedDays = calculateVacationDays(vacation);
        double usedDays =
                calculateUsedVacationDays(vacation.getMemberId());
        double remainingDays = 15.0 - usedDays;

        if (requestedDays > remainingDays) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "잔여 연차가 부족하여 승인할 수 없습니다. "
                            + "현재 잔여 연차는 "
                            + remainingDays
                            + "일입니다."
            );
        }

        Integer result = dao.approveVacation(vacationId);

        if (result == null || result == 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "휴가 승인에 실패했습니다."
            );
        }
    }

    public void rejectVacation(Integer vacationId) {

        Vacation vacation = dao.findByVacationId(vacationId);

        if (vacation == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "휴가 신청 내역을 찾을 수 없습니다."
            );
        }

        if (!"대기".equals(vacation.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "이미 처리된 휴가 신청입니다."
            );
        }

        Integer result = dao.rejectVacation(vacationId);

        if (result == null || result == 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "휴가 반려에 실패했습니다."
            );
        }
    }


}