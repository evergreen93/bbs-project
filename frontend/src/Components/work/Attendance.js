import { useContext, useEffect, useMemo, useState } from "react";
import "../../css/attendance.css";
import axios from "axios";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

function Attendance() {
    const { headers } = useContext(HttpHeadersContext);
    const [isVacation, setIsVacation] = useState(false);
    const getTodayVacation = async () => {
        try {
            const response = await axios.get(
                "/api/vacations/today",
                { headers }
            );

            setIsVacation(response.data.isVacation);
        } catch (error) {
            console.error(
                "오늘 휴가 여부 조회 오류:",
                error.response?.data || error
            );
        }
    };

    const [attendance, setAttendance] = useState({
        workDate: new Date().toISOString().slice(0, 10),
        startTime: null,
        endTime: null,
        status: "미출근"
    });

    const [attendanceHistory, setAttendanceHistory] = useState([]);

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        getTodayAttendance();

        getAttendanceHistory();

        getTodayVacation();


        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    };

    const workDuration = useMemo(() => {
        if (!attendance.startTime) {
            return "0시간 0분";
        }

        const end = attendance.endTime
            ? new Date(attendance.endTime)
            : currentTime;

        const start = new Date(attendance.startTime);
        const diffMinutes = Math.max(
            0,
            Math.floor((end.getTime() - start.getTime()) / 60000)
        );

        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;

        return `${hours}시간 ${minutes}분`;
    }, [attendance.startTime, attendance.endTime, currentTime]);

    const handleStartWork = async () => {
        try {
            const response = await axios.post(
                "/api/attendance/start",
                null,
                { headers }
            );

            // 위쪽 오늘 근태 즉시 변경
            setAttendance(response.data);

            // 아래쪽 최근 근태 기록 다시 조회
            await getAttendanceHistory();

            alert("출근 처리되었습니다.");
        } catch (error) {
            const data = error.response?.data;

            const message =
                typeof data === "string"
                    ? data
                    : data?.message;

            alert(message || "정해진 출근 시간이 아닙니다.");
        }
    };

    const handleEndWork = async () => {
        try {
            const response = await axios.post(
                "/api/attendance/end",
                null,
                { headers }
            );

            // 위쪽 오늘 근태 즉시 변경
            setAttendance(response.data);

            // 아래쪽 최근 근태 기록 다시 조회
            await getAttendanceHistory();

            alert("퇴근 처리되었습니다.");
        } catch (error) {
            console.error(
                "퇴근 처리 오류:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "퇴근 처리 중 오류가 발생했습니다."
            );
        }
    };

    const getTodayAttendance = async () => {
        try {
            const response = await axios.get(
                "/api/attendance/today",
                { headers }
            );

            console.log(response.data);

            if (response.data) {
                setAttendance(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getAttendanceHistory = async () => {
        try {
            const response = await axios.get(
                "/api/attendance/history",
                { headers }
            );

            console.log(response.data);
            setAttendanceHistory(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    const statusClassName = {
        미출근: "attendance-status waiting",
        근무중: "attendance-status working",
        퇴근: "attendance-status finished"
    }[attendance.status];

    const history = [
        {
            date: "2026-07-27",
            startTime: "09:02",
            endTime: "18:10",
            workTime: "9시간 8분",
            status: "정상"
        },
        {
            date: "2026-07-26",
            startTime: "09:14",
            endTime: "18:05",
            workTime: "8시간 51분",
            status: "지각"
        },
        {
            date: "2026-07-25",
            startTime: "08:56",
            endTime: "18:02",
            workTime: "9시간 6분",
            status: "정상"
        }
    ];

    const calculateWorkTime = (startTime, endTime) => {
        if (!startTime || !endTime) {
            return "-";
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        const diffMinutes = Math.floor((end - start) / 1000 / 60);
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;

        return `${hours}시간 ${minutes}분`;
    };



    return (
        <div className="attendance-page">
            <section className="attendance-heading">
                <div>
                    <p className="attendance-eyebrow">ATTENDANCE</p>
                    <h1>근태 관리</h1>
                    <p>오늘의 출퇴근 상태와 근무 시간을 확인하세요.</p>
                </div>

                <div className="attendance-current-time">
					<span>
						{currentTime.toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            weekday: "long"
                        })}
					</span>

                    <strong>
                        {currentTime.toLocaleTimeString("ko-KR")}
                    </strong>
                </div>
            </section>

            <section className="attendance-summary">
                <div className="attendance-main-card">
                    <div className="attendance-main-header">
                        <div>
                            <p>오늘 근무 상태</p>
                            <h2>  {isVacation ? "휴가" : attendance.status}</h2>
                        </div>

                        <span className={statusClassName}>
							{attendance.status}
						</span>
                    </div>

                    <div className="attendance-time-grid">
                        <div>
                            <span>출근 시간</span>
                            <strong>{formatTime(attendance.startTime)}</strong>
                        </div>

                        <div>
                            <span>퇴근 시간</span>
                            <strong>{formatTime(attendance.endTime)}</strong>
                        </div>

                        <div>
                            <span>누적 근무시간</span>
                            <strong>{workDuration}</strong>
                        </div>
                    </div>

                    <div className="attendance-actions">
                        <button
                            type="button"
                            className="attendance-button start"
                            onClick={handleStartWork}
                            disabled={
                                isVacation ||
                                Boolean(attendance.startTime)
                            }
                        >
                            <i className="fas fa-sign-in-alt"></i>
                            출근하기
                        </button>

                        <button
                            type="button"
                            className="attendance-button end"
                            onClick={handleEndWork}
                            disabled={!attendance.startTime || Boolean(attendance.endTime)}
                        >
                            <i className="fas fa-sign-out-alt"></i>
                            퇴근하기
                        </button>
                    </div>
                </div>

                <div className="attendance-guide-card">
                    <p className="attendance-eyebrow">WORK GUIDE</p>
                    <h3>오늘의 근무 안내</h3>

                    <ul>
                        <li>
                            <span>권장 출근 시간</span>
                            <strong>09:00</strong>
                        </li>
                        <li>
                            <span>권장 퇴근 시간</span>
                            <strong>18:00</strong>
                        </li>
                        <li>
                            <span>기준 근무시간</span>
                            <strong>8시간</strong>
                        </li>
                    </ul>

                    <p className="attendance-guide-message">
                        출근 및 퇴근 버튼은 하루에 한 번씩만 처리할 수 있습니다.
                    </p>
                </div>
            </section>

            <section className="attendance-history-card">
                <div className="attendance-history-header">
                    <div>
                        <p className="attendance-eyebrow">HISTORY</p>
                        <h2>최근 근태 기록</h2>
                    </div>

                    <button type="button" className="attendance-outline-button">
                        전체 기록 보기
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="table attendance-table">
                        <thead>
                        <tr>
                            <th>근무일</th>
                            <th>출근 시간</th>
                            <th>퇴근 시간</th>
                            <th>근무시간</th>
                            <th>상태</th>
                        </tr>
                        </thead>

                        <tbody>
                        {attendanceHistory.map((item) => (
                            <tr key={item.attendanceId}>
                                <td>{item.workDate}</td>

                                <td>
                                    {item.startTime
                                        ? item.startTime.slice(11, 16)
                                        : "-"}
                                </td>

                                <td>
                                    {item.endTime
                                        ? item.endTime.slice(11, 16)
                                        : "-"}
                                </td>

                                <td>
                                    {calculateWorkTime(item.startTime, item.endTime)}
                                </td>

                                <td>
            <span
                className={
                    item.status === "퇴근"
                        ? "attendance-history-badge normal"
                        : "attendance-history-badge late"
                }
            >
                {item.status}
            </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default Attendance;