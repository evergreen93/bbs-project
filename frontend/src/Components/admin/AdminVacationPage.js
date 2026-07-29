import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/adminVacation.css";

function AdminVacationPage() {
    const [vacations, setVacations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("bbs_access_token");

    const fetchPendingVacations = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                "/api/admin/vacations/pending",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setVacations(response.data);
        } catch (error) {
            console.error("휴가 신청 목록 조회 실패", error);
            setMessage("휴가 신청 목록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingVacations();
    }, []);

    const handleApprove = async (vacationId) => {
        const confirmed = window.confirm(
            "해당 휴가 신청을 승인하시겠습니까?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setProcessingId(vacationId);
            setMessage("");

            await axios.post(
                `/api/admin/vacations/${vacationId}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setVacations((prev) =>
                prev.filter(
                    (vacation) =>
                        vacation.vacationId !== vacationId
                )
            );

            setMessage("휴가 신청을 승인했습니다.");
        } catch (error) {
            console.error("휴가 승인 실패", error);

            const errorMessage =
                error.response?.data?.message ||
                "휴가 승인 처리에 실패했습니다.";

            setMessage(errorMessage);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (vacationId) => {
        const confirmed = window.confirm(
            "해당 휴가 신청을 반려하시겠습니까?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setProcessingId(vacationId);
            setMessage("");

            await axios.post(
                `/api/admin/vacations/${vacationId}/reject`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setVacations((prev) =>
                prev.filter(
                    (vacation) =>
                        vacation.vacationId !== vacationId
                )
            );

            setMessage("휴가 신청을 반려했습니다.");
        } catch (error) {
            console.error("휴가 반려 실패", error);

            const errorMessage =
                error.response?.data?.message ||
                "휴가 반려 처리에 실패했습니다.";

            setMessage(errorMessage);
        } finally {
            setProcessingId(null);
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return date.replaceAll("-", ".");
    };

    const getVacationTypeClass = (vacationType) => {
        switch (vacationType) {
            case "연차":
                return "annual";
            case "반차":
                return "half";
            case "병가":
                return "sick";
            default:
                return "etc";
        }
    };

    return (
        <div className="admin-vacation-page">
            <div className="admin-vacation-container">
                <header className="admin-vacation-header">
                    <div>
                        <p className="admin-vacation-eyebrow">
                            OFFICEFLOW ADMIN
                        </p>

                        <h1>휴가 승인 관리</h1>

                        <p className="admin-vacation-description">
                            직원이 신청한 휴가 내역을 확인하고
                            승인 또는 반려할 수 있습니다.
                        </p>
                    </div>

                    <div className="pending-summary-card">
                        <span>승인 대기</span>
                        <strong>{vacations.length}</strong>
                        <small>건</small>
                    </div>
                </header>

                {message && (
                    <div className="admin-vacation-message">
                        {message}
                    </div>
                )}

                <section className="vacation-management-card">
                    <div className="vacation-card-header">
                        <div>
                            <h2>대기 중인 휴가 신청</h2>
                            <p>
                                신청 내용을 검토한 후 처리해 주세요.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="vacation-refresh-button"
                            onClick={fetchPendingVacations}
                            disabled={loading}
                        >
                            {loading ? "불러오는 중" : "새로고침"}
                        </button>
                    </div>

                    {loading ? (
                        <div className="vacation-state-box">
                            <div className="vacation-spinner" />
                            <p>휴가 신청 목록을 불러오는 중입니다.</p>
                        </div>
                    ) : vacations.length === 0 ? (
                        <div className="vacation-state-box">
                            <div className="vacation-empty-icon">
                                ✓
                            </div>

                            <h3>대기 중인 신청이 없습니다.</h3>

                            <p>
                                모든 휴가 신청이 처리되었습니다.
                            </p>
                        </div>
                    ) : (
                        <div className="vacation-table-wrapper">
                            <table className="vacation-table">
                                <thead>
                                <tr>
                                    <th>신청자</th>
                                    <th>휴가 종류</th>
                                    <th>휴가 기간</th>
                                    <th>신청 사유</th>
                                    <th>상태</th>
                                    <th>관리</th>
                                </tr>
                                </thead>

                                <tbody>
                                {vacations.map((vacation) => {
                                    const isProcessing =
                                        processingId ===
                                        vacation.vacationId;

                                    return (
                                        <tr
                                            key={
                                                vacation.vacationId
                                            }
                                        >
                                            <td>
                                                <div className="vacation-member-cell">
                                                    <div className="vacation-member-avatar">
                                                        {(
                                                            vacation.memberName ||
                                                            vacation.memberId ||
                                                            "사"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {vacation.memberName ||
                                                                vacation.memberId}
                                                        </strong>

                                                        <span>
                                                                {vacation.department ||
                                                                    "소속 정보 없음"}
                                                            </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                    <span
                                                        className={`vacation-type-badge ${getVacationTypeClass(
                                                            vacation.vacationType
                                                        )}`}
                                                    >
                                                        {
                                                            vacation.vacationType
                                                        }
                                                    </span>
                                            </td>

                                            <td>
                                                <div className="vacation-date-cell">
                                                    <strong>
                                                        {formatDate(
                                                            vacation.startDate
                                                        )}
                                                    </strong>

                                                    <span>~</span>

                                                    <strong>
                                                        {formatDate(
                                                            vacation.endDate
                                                        )}
                                                    </strong>
                                                </div>
                                            </td>

                                            <td>
                                                <div
                                                    className="vacation-reason"
                                                    title={
                                                        vacation.reason
                                                    }
                                                >
                                                    {vacation.reason ||
                                                        "사유 없음"}
                                                </div>
                                            </td>

                                            <td>
                                                    <span className="vacation-status-badge">
                                                        대기
                                                    </span>
                                            </td>

                                            <td>
                                                <div className="vacation-action-buttons">
                                                    <button
                                                        type="button"
                                                        className="vacation-approve-button"
                                                        onClick={() =>
                                                            handleApprove(
                                                                vacation.vacationId
                                                            )
                                                        }
                                                        disabled={
                                                            isProcessing
                                                        }
                                                    >
                                                        {isProcessing
                                                            ? "처리 중"
                                                            : "승인"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="vacation-reject-button"
                                                        onClick={() =>
                                                            handleReject(
                                                                vacation.vacationId
                                                            )
                                                        }
                                                        disabled={
                                                            isProcessing
                                                        }
                                                    >
                                                        반려
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default AdminVacationPage;