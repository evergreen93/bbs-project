import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";
import "../../css/dashboard.css";

function Dashboard() {
    const { auth } = useContext(AuthContext);
    const { headers } = useContext(HttpHeadersContext);
    const [remainingVacationDays, setRemainingVacationDays] = useState(15);
    const [recentBoards, setRecentBoards] = useState([]);
    const [todayVacationCount, setTodayVacationCount] = useState(0);
    const [boardCount, setBoardCount] = useState(0);
    const [attendanceStatus, setAttendanceStatus] = useState("미출근");

    useEffect(() => {
        const getDashboardData = async () => {
            try {
                const [
                    boardResponse,
                    vacationResponse,
                    remainingResponse,
                    attendanceResponse
                ] = await Promise.all([
                    axios.get("/api/bbs?choice=&search=&page=1", { headers }),
                    axios.get("/api/vacation/today/count", { headers }),
                    axios.get("/api/vacation/remaining", { headers }),
                    axios.get("/api/attendance/today", { headers })
                ]);

                setRemainingVacationDays(remainingResponse.data);

                const boards = boardResponse.data?.bbsList || [];

                const attendanceData = attendanceResponse.data;

                if (!attendanceData || !attendanceData.startTime) {
                    setAttendanceStatus("미출근");
                } else if (!attendanceData.endTime) {
                    setAttendanceStatus("출근");
                } else {
                    setAttendanceStatus("퇴근");
                }

                setRecentBoards(boards.slice(0, 3));
                setBoardCount(boardResponse.data?.pageCnt || 0);
                setTodayVacationCount(vacationResponse.data || 0);
            } catch (error) {
                console.error(
                    "대시보드 조회 실패:",
                    error.response?.data || error
                );

                if (error.response?.status === 401) {
                    alert("로그인 시간이 만료되었습니다. 다시 로그인해주세요.");
                }
            }
        };

        if (headers) {
            getDashboardData();
        }
    }, [headers]);

    return (
        <div className="dashboard-page">

            <section className="dashboard-welcome">
                <div>
                    <p className="dashboard-eyebrow">OFFICEFLOW</p>
                    <h1>
                        안녕하세요, <span>{auth || "사용자"}</span>님
                    </h1>
                    <p>오늘도 편안하고 생산적인 하루 보내세요.</p>
                </div>

                <div className="dashboard-date">
                    <p>오늘</p>
                    <strong>
                        {new Date().toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            weekday: "long"
                        })}
                    </strong>
                </div>
            </section>

            <section className="dashboard-card-grid">

                <div className="dashboard-card">
                    <div className="dashboard-card-icon blue">
                        <i className="fas fa-clock"></i>
                    </div>
                    <div>
                        <p>오늘 출근 상태</p>
                        <h3>{attendanceStatus}</h3>

                        <span
                            className={
                                attendanceStatus === "미출근"
                                    ? "dashboard-badge warning"
                                    : attendanceStatus === "출근"
                                        ? "dashboard-badge working"
                                        : "dashboard-badge finished"
                            }
                        >
                             {attendanceStatus === "미출근"
                                ? "출근 전"
                                : attendanceStatus === "출근"
                                    ? "근무 중"
                                    : "퇴근 완료"}
                        </span>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-card-icon sky">
                        <i className="fas fa-calendar-check"></i>
                    </div>
                    <div>
                        <p>남은 연차</p>
                        <h3>{remainingVacationDays}일</h3>
                        <span className="dashboard-caption">총 연차 15일</span>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-card-icon indigo">
                        <i className="fas fa-users"></i>
                    </div>
                    <div>
                        <p>오늘 휴가자</p>
                        <h3>{todayVacationCount}명</h3>
                        <span className="dashboard-caption">회사 전체 기준</span>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-card-icon navy">
                        <i className="fas fa-clipboard-list"></i>
                    </div>
                    <div>
                        <p>전체 게시글</p>
                        <h3>{boardCount}건</h3>
                        <span className="dashboard-caption">
                            최근 게시글 {recentBoards.length}건 표시
                        </span>
                    </div>
                </div>

            </section>

            <section className="dashboard-content-grid">

                <div className="dashboard-panel">
                    <div className="dashboard-panel-header">
                        <div>
                            <p className="dashboard-panel-label">BOARD</p>
                            <h2>최근 게시글</h2>
                        </div>

                        <a href="/bbslist">전체보기</a>
                    </div>

                    <div className="dashboard-board-list">
                        {recentBoards.length > 0 ? (
                            recentBoards.map((board) => (
                                <div
                                    className="dashboard-board-row"
                                    key={board.seq}
                                >
                                    <div>
                                        <strong>{board.title}</strong>
                                        <p>{board.id}</p>
                                    </div>

                                    <span>
                                        {board.createdAt
                                            ? board.createdAt.substring(0, 10)
                                            : ""}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="dashboard-board-row">
                                <div>
                                    <strong>등록된 게시글이 없습니다.</strong>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="dashboard-panel">
                    <div className="dashboard-panel-header">
                        <div>
                            <p className="dashboard-panel-label">TODAY</p>
                            <h2>오늘 일정</h2>
                        </div>
                    </div>

                    <div className="dashboard-schedule-list">
                        <div className="dashboard-schedule-item">
                            <span>09:00</span>
                            <div>
                                <strong>업무 시작</strong>
                                <p>출근 상태를 확인하세요.</p>
                            </div>
                        </div>

                        <div className="dashboard-schedule-item">
                            <span>14:00</span>
                            <div>
                                <strong>주간 회의</strong>
                                <p>회의실 A</p>
                            </div>
                        </div>

                        <div className="dashboard-schedule-item">
                            <span>18:00</span>
                            <div>
                                <strong>퇴근 예정</strong>
                                <p>오늘 근무시간을 확인하세요.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

        </div>
    );
}

export default Dashboard;