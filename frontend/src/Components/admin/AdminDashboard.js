import axios from "axios";
import {
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";

import { Link } from "react-router-dom";

import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

import "../../css/admin-dashboard.css";

function AdminDashboard() {
    const { auth } = useContext(AuthContext);
    const { headers } = useContext(HttpHeadersContext);

    const [boardCount, setBoardCount] = useState(0);
    const [memberCount, setMemberCount] = useState(0);
    const [memberList, setMemberList] = useState([]);
    const [commentCount, setCommentCount] = useState(0);

    const [attendanceSummary, setAttendanceSummary] = useState({
        workingCount: 0,
        finishedCount: 0,
        absentCount: 0,
        vacationCount: 0
    });

    const [
        pendingVacationCount,
        setPendingVacationCount
    ] = useState(0);

    const [
        pendingVacations,
        setPendingVacations
    ] = useState([]);

    const [loading, setLoading] = useState(false);
    const [processingId, setProcessingId] = useState(null);

    /*
     * 관리자 대시보드 데이터 조회
     *
     * 게시글 수
     * 댓글 수
     * 회원 수
     * 회원 목록
     * 오늘 근태 현황
     * 휴가 승인 대기 수
     * 휴가 승인 대기 목록
     */
    const refreshAdminData = useCallback(async () => {
        if (!headers?.Authorization) {
            console.warn(
                "관리자 대시보드 요청 중단: Authorization 헤더가 없습니다."
            );

            return;
        }

        setLoading(true);

        try {
            const [
                boardCountResponse,
                commentCountResponse,
                memberCountResponse,
                memberListResponse,
                attendanceResponse,
                pendingCountResponse,
                pendingListResponse
            ] = await Promise.all([
                axios.get(
                    "/api/admin/boards/count",
                    { headers }
                ),

                axios.get(
                    "/api/admin/comments/count",
                    { headers }
                ),

                axios.get(
                    "/api/admin/members/count",
                    { headers }
                ),

                axios.get(
                    "/api/admin/members",
                    { headers }
                ),

                axios.get(
                    "/api/admin/attendance/today/summary",
                    { headers }
                ),

                axios.get(
                    "/api/admin/vacations/pending/count",
                    { headers }
                ),

                axios.get(
                    "/api/admin/vacations/pending",
                    { headers }
                )
            ]);

            setBoardCount(
                boardCountResponse.data ?? 0
            );

            setCommentCount(
                commentCountResponse.data ?? 0
            );

            setMemberCount(
                memberCountResponse.data ?? 0
            );

            setMemberList(
                Array.isArray(memberListResponse.data)
                    ? memberListResponse.data
                    : []
            );

            setAttendanceSummary({
                workingCount:
                    attendanceResponse.data?.workingCount ?? 0,

                finishedCount:
                    attendanceResponse.data?.finishedCount ?? 0,

                absentCount:
                    attendanceResponse.data?.absentCount ?? 0,

                vacationCount:
                    attendanceResponse.data?.vacationCount ?? 0
            });

            setPendingVacationCount(
                pendingCountResponse.data ?? 0
            );

            setPendingVacations(
                Array.isArray(pendingListResponse.data)
                    ? pendingListResponse.data
                    : []
            );
        } catch (error) {
            console.error(
                "관리자 대시보드 조회 실패:",
                error.response?.data || error
            );

            if (error.response?.status === 401) {
                alert(
                    "로그인 시간이 만료되었습니다. 다시 로그인해주세요."
                );
            } else if (error.response?.status === 403) {
                alert("관리자 권한이 없습니다.");
            } else {
                alert(
                    error.response?.data?.message ??
                    error.response?.data ??
                    "관리자 데이터를 불러오지 못했습니다."
                );
            }
        } finally {
            setLoading(false);
        }
    }, [headers]);

    useEffect(() => {
        refreshAdminData();
    }, [refreshAdminData]);

    const approveVacation = async (vacationId) => {
        const confirmed = window.confirm(
            "이 휴가 신청을 승인하시겠습니까?"
        );

        if (!confirmed) {
            return;
        }

        setProcessingId(vacationId);

        try {
            await axios.post(
                `/api/admin/vacations/${vacationId}/approve`,
                {},
                { headers }
            );

            alert("휴가가 승인되었습니다.");

            await refreshAdminData();
        } catch (error) {
            console.error(
                "휴가 승인 실패:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ??
                error.response?.data ??
                "휴가 승인에 실패했습니다."
            );
        } finally {
            setProcessingId(null);
        }
    };

    const rejectVacation = async (vacationId) => {
        const confirmed = window.confirm(
            "이 휴가 신청을 반려하시겠습니까?"
        );

        if (!confirmed) {
            return;
        }

        setProcessingId(vacationId);

        try {
            await axios.post(
                `/api/admin/vacations/${vacationId}/reject`,
                {},
                { headers }
            );

            alert("휴가가 반려되었습니다.");

            await refreshAdminData();
        } catch (error) {
            console.error(
                "휴가 반려 실패:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ??
                error.response?.data ??
                "휴가 반려에 실패했습니다."
            );
        } finally {
            setProcessingId(null);
        }
    };

    const formatVacationPeriod = (vacation) => {
        if (!vacation.startDate) {
            return "-";
        }

        if (
            !vacation.endDate ||
            vacation.startDate === vacation.endDate
        ) {
            return vacation.startDate;
        }

        return `${vacation.startDate} ~ ${vacation.endDate}`;
    };

    return (
        <div className="admin-dashboard-page">

            <section className="admin-dashboard-heading">
                <div>
                    <p className="admin-dashboard-eyebrow">
                        OFFICEFLOW ADMIN
                    </p>

                    <h1>관리자 대시보드</h1>

                    <p>
                        안녕하세요,{" "}
                        <strong>
                            {auth || "관리자"}
                        </strong>
                        님. 오늘의 서비스 현황을 확인하세요.
                    </p>
                </div>

                <div className="admin-dashboard-date">
                    <span>관리자 모드</span>

                    <strong>
                        {new Date().toLocaleDateString(
                            "ko-KR",
                            {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                weekday: "long"
                            }
                        )}
                    </strong>
                </div>
            </section>

            <section className="admin-stat-grid">

                <article className="admin-stat-card">
                    <div className="admin-stat-icon members">
                        <i className="fas fa-user-friends"></i>
                    </div>

                    <div>
                        <p>전체 회원</p>

                        <h2>
                            {loading ? "-" : memberCount}명
                        </h2>

                        <span>등록된 전체 계정</span>
                    </div>
                </article>

                <article className="admin-stat-card">
                    <div className="admin-stat-icon boards">
                        <i className="fas fa-clipboard-list"></i>
                    </div>

                    <div>
                        <p>전체 게시글</p>

                        <h2>
                            {loading ? "-" : boardCount}건
                        </h2>

                        <span>등록된 전체 게시글</span>
                    </div>
                </article>

                <article className="admin-stat-card">
                    <div className="admin-stat-icon comments">
                        <i className="fas fa-comments"></i>
                    </div>

                    <div>
                        <p>전체 댓글</p>

                        <h2>
                            {loading ? "-" : commentCount}건
                        </h2>

                        <span>등록된 전체 댓글</span>
                    </div>
                </article>

                <article className="admin-stat-card">
                    <div className="admin-stat-icon vacation">
                        <i className="fas fa-calendar-check"></i>
                    </div>

                    <div>
                        <p>휴가 승인 대기</p>

                        <h2>
                            {loading
                                ? "-"
                                : pendingVacationCount}
                            건
                        </h2>

                        <span className="admin-stat-warning">
                            {pendingVacationCount > 0
                                ? "확인이 필요합니다"
                                : "대기 중인 신청 없음"}
                        </span>
                    </div>
                </article>

            </section>

            <section className="admin-status-grid">

                <article className="admin-status-card">
                    <div className="admin-status-top">
                        <div>
                            <p>TODAY ATTENDANCE</p>
                            <h2>오늘 근태 현황</h2>
                        </div>

                        <Link to="/admin/attendance">
                            전체보기
                        </Link>
                    </div>

                    <div className="admin-attendance-grid">
                        <div>
                            <span
                                className={
                                    "admin-status-dot working"
                                }
                            />

                            <p>근무 중</p>

                            <strong>
                                {loading
                                    ? "-"
                                    : attendanceSummary.workingCount}
                                명
                            </strong>
                        </div>

                        <div>
                            <span
                                className={
                                    "admin-status-dot finished"
                                }
                            />

                            <p>퇴근</p>

                            <strong>
                                {loading
                                    ? "-"
                                    : attendanceSummary.finishedCount}
                                명
                            </strong>
                        </div>

                        <div>
                            <span
                                className={
                                    "admin-status-dot absent"
                                }
                            />

                            <p>미출근</p>

                            <strong>
                                {loading
                                    ? "-"
                                    : attendanceSummary.absentCount}
                                명
                            </strong>
                        </div>

                        <div>
                            <span
                                className={
                                    "admin-status-dot leave"
                                }
                            />

                            <p>휴가</p>

                            <strong>
                                {loading
                                    ? "-"
                                    : attendanceSummary.vacationCount}
                                명
                            </strong>
                        </div>
                    </div>
                </article>

                <article
                    className={
                        "admin-status-card admin-quick-card"
                    }
                >
                    <div className="admin-status-top">
                        <div>
                            <p>QUICK MANAGEMENT</p>
                            <h2>빠른 관리</h2>
                        </div>
                    </div>

                    <div className="admin-quick-grid">

                        <Link to="/admin/members">
                            <i className="fas fa-users-cog"></i>

                            <div>
                                <strong>회원 관리</strong>

                                <span>
                                    회원 권한 및 상태 변경
                                </span>
                            </div>

                            <i className="fas fa-chevron-right"></i>
                        </Link>

                        <Link to="/admin/vacations">
                            <i className="fas fa-calendar-alt"></i>

                            <div>
                                <strong>휴가 관리</strong>

                                <span>
                                    휴가 승인 및 반려
                                </span>
                            </div>

                            <i className="fas fa-chevron-right"></i>
                        </Link>

                        <Link to="/admin/boards">
                            <i className="fas fa-file-alt"></i>

                            <div>
                                <strong>게시글 관리</strong>

                                <span>
                                    게시글 조회 및 삭제
                                </span>
                            </div>

                            <i className="fas fa-chevron-right"></i>
                        </Link>

                    </div>
                </article>

            </section>

            <section className="admin-content-grid">

                <article className="admin-panel">
                    <div className="admin-panel-header">
                        <div>
                            <p>MEMBER LIST</p>
                            <h2>회원 목록</h2>
                        </div>

                        <Link to="/admin/members">
                            전체보기
                        </Link>
                    </div>

                    <div className="admin-member-list">
                        {loading ? (
                            <div className="admin-empty-message">
                                회원 정보를 불러오는 중입니다.
                            </div>
                        ) : memberList.length > 0 ? (
                            memberList.map((member) => (
                                <div
                                    className="admin-member-row"
                                    key={member.id}
                                >
                                    <div className="admin-member-avatar">
                                        {member.name
                                            ? member.name.charAt(0)
                                            : "U"}
                                    </div>

                                    <div className="admin-member-info">
                                        <strong>
                                            {member.name || "-"}
                                        </strong>

                                        <p>
                                            {member.id}
                                        </p>
                                    </div>

                                    <div className="admin-member-email">
                                        {member.email || "-"}
                                    </div>

                                    <span
                                        className={
                                            member.role === "ADMIN"
                                                ? "admin-role-badge admin"
                                                : "admin-role-badge user"
                                        }
                                    >
                                        {member.role || "USER"}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="admin-empty-message">
                                등록된 회원이 없습니다.
                            </div>
                        )}
                    </div>
                </article>

                <article className="admin-panel">
                    <div className="admin-panel-header">
                        <div>
                            <p>VACATION REQUEST</p>
                            <h2>휴가 승인 대기</h2>
                        </div>

                        <Link to="/admin/vacations">
                            전체보기
                        </Link>
                    </div>

                    <div className="admin-vacation-list">
                        {loading ? (
                            <div className="admin-empty-message">
                                휴가 신청 내역을 불러오는 중입니다.
                            </div>
                        ) : pendingVacations.length > 0 ? (
                            pendingVacations.map((vacation) => {
                                const isProcessing =
                                    processingId ===
                                    vacation.vacationId;

                                return (
                                    <div
                                        className="admin-vacation-row"
                                        key={vacation.vacationId}
                                    >
                                        <div>
                                            <strong>
                                                {vacation.memberId}
                                            </strong>

                                            <p>
                                                {vacation.vacationType}

                                                <span> · </span>

                                                {formatVacationPeriod(
                                                    vacation
                                                )}
                                            </p>

                                            {vacation.reason && (
                                                <p>
                                                    사유:{" "}
                                                    {vacation.reason}
                                                </p>
                                            )}
                                        </div>

                                        <div className="admin-vacation-actions">
                                            <button
                                                type="button"
                                                className="approve"
                                                disabled={isProcessing}
                                                onClick={() =>
                                                    approveVacation(
                                                        vacation.vacationId
                                                    )
                                                }
                                            >
                                                {isProcessing
                                                    ? "처리 중"
                                                    : "승인"}
                                            </button>

                                            <button
                                                type="button"
                                                className="reject"
                                                disabled={isProcessing}
                                                onClick={() =>
                                                    rejectVacation(
                                                        vacation.vacationId
                                                    )
                                                }
                                            >
                                                {isProcessing
                                                    ? "처리 중"
                                                    : "반려"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="admin-empty-message">
                                승인 대기 중인 휴가가 없습니다.
                            </div>
                        )}
                    </div>
                </article>

            </section>

        </div>
    );
}

export default AdminDashboard;