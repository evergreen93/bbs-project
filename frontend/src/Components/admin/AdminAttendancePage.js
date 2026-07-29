import axios from "axios";
import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

import { HttpHeadersContext } from "../context/HttpHeadersProvider";

import "../../css/admin-attendance.css";

function AdminAttendancePage() {
    const { headers } = useContext(HttpHeadersContext);

    const today = useMemo(() => {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }, []);

    const [selectedDate, setSelectedDate] = useState(today);
    const [attendanceList, setAttendanceList] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const [editingMemberId, setEditingMemberId] = useState(null);

    const [editForm, setEditForm] = useState({
        status: "",
        startTime: "",
        endTime: ""
    });

    const getAttendanceList = useCallback(async () => {
        if (!headers?.Authorization) {
            setMessage("로그인 정보가 없습니다. 다시 로그인해주세요.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const response = await axios.get(
                "/api/admin/attendance",
                {
                    params: {
                        date: selectedDate
                    },
                    headers
                }
            );

            setAttendanceList(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (error) {
            console.error(
                "근태 목록 조회 실패:",
                error.response?.data || error
            );

            setAttendanceList([]);

            setMessage(
                error.response?.data?.message ||
                (typeof error.response?.data === "string"
                    ? error.response.data
                    : "근태 목록을 불러오지 못했습니다.")
            );
        } finally {
            setLoading(false);
        }
    }, [headers, selectedDate]);

    useEffect(() => {
        getAttendanceList();
    }, [getAttendanceList]);

    const getStatusText = (status) => {
        switch (status) {
            case "WORKING":
                return "근무 중";

            case "FINISHED":
                return "퇴근";

            case "ABSENT":
                return "미출근";

            case "VACATION":
                return "휴가";

            default:
                return status || "-";
        }
    };

    const getStatusClassName = (status) => {
        switch (status) {
            case "WORKING":
                return "working";

            case "FINISHED":
                return "done";

            case "ABSENT":
                return "absent";

            case "VACATION":
                return "vacation";

            default:
                return "waiting";
        }
    };

    const extractTime = (value) => {
        if (!value) {
            return "";
        }

        const text = String(value);

        /*
         * 가능한 형식
         * 09:00
         * 09:00:00
         * 2026-07-29T09:00:00
         * 2026-07-29 09:00:00
         */

        const dateTimeMatch = text.match(
            /(?:T|\s)(\d{2}):(\d{2})/
        );

        if (dateTimeMatch) {
            return `${dateTimeMatch[1]}:${dateTimeMatch[2]}`;
        }

        const timeMatch = text.match(
            /^(\d{1,2}):(\d{2})/
        );

        if (timeMatch) {
            return `${String(timeMatch[1]).padStart(2, "0")}:${timeMatch[2]}`;
        }

        return "";
    };

    const formatTime = (value) => {
        return extractTime(value) || "-";
    };

    const calculateWorkTime = (startTime, endTime) => {
        const normalizedStartTime = extractTime(startTime);
        const normalizedEndTime = extractTime(endTime);

        if (!normalizedStartTime || !normalizedEndTime) {
            return "-";
        }

        const [startHour, startMinute] =
            normalizedStartTime.split(":").map(Number);

        const [endHour, endMinute] =
            normalizedEndTime.split(":").map(Number);

        if (
            Number.isNaN(startHour) ||
            Number.isNaN(startMinute) ||
            Number.isNaN(endHour) ||
            Number.isNaN(endMinute)
        ) {
            return "-";
        }

        const startMinutes =
            startHour * 60 + startMinute;

        const endMinutes =
            endHour * 60 + endMinute;

        const difference =
            endMinutes - startMinutes;

        if (difference < 0) {
            return "-";
        }

        const hours = Math.floor(difference / 60);
        const minutes = difference % 60;

        return `${hours}시간 ${minutes}분`;
    };

    const filteredList = useMemo(() => {
        const searchKeyword = keyword.trim().toLowerCase();

        return attendanceList.filter((attendance) => {
            const memberId =
                String(
                    attendance.memberId ||
                    attendance.id ||
                    ""
                ).toLowerCase();

            const memberName =
                String(
                    attendance.memberName ||
                    attendance.name ||
                    ""
                ).toLowerCase();

            const department =
                String(
                    attendance.department ||
                    attendance.departmentName ||
                    attendance.deptName ||
                    ""
                ).toLowerCase();

            const matchesKeyword =
                !searchKeyword ||
                memberId.includes(searchKeyword) ||
                memberName.includes(searchKeyword) ||
                department.includes(searchKeyword);

            const matchesStatus =
                statusFilter === "ALL" ||
                attendance.status === statusFilter;

            return matchesKeyword && matchesStatus;
        });
    }, [attendanceList, keyword, statusFilter]);

    const totalCount = attendanceList.length;

    const workingCount = attendanceList.filter(
        (attendance) => attendance.status === "WORKING"
    ).length;

    const finishedCount = attendanceList.filter(
        (attendance) => attendance.status === "FINISHED"
    ).length;

    const absentCount = attendanceList.filter(
        (attendance) => attendance.status === "ABSENT"
    ).length;

    const vacationCount = attendanceList.filter(
        (attendance) => attendance.status === "VACATION"
    ).length;

    const startEdit = (attendance) => {


        if (attendance.status === "VACATION") {
            alert("휴가 상태는 휴가 관리에서 변경해야 합니다.");
            return;
        }

        const memberId =
            attendance.memberId ||
            attendance.id;

        setEditingMemberId(memberId);

        setEditForm({
            status: attendance.status || "ABSENT",
            startTime: extractTime(attendance.startTime),
            endTime: extractTime(attendance.endTime)
        });

        setMessage("");
    };

    const cancelEdit = () => {
        setEditingMemberId(null);

        setEditForm({
            status: "",
            startTime: "",
            endTime: ""
        });
    };

    const handleStatusChange = (event) => {
        const status = event.target.value;

        setEditForm((previous) => ({
            ...previous,
            status,

            startTime:
                status === "ABSENT"
                    ? ""
                    : previous.startTime,

            endTime:
                status === "FINISHED"
                    ? previous.endTime
                    : ""
        }));
    };



    const saveAttendance = async (attendance) => {
        const memberId =
            attendance.memberId ||
            attendance.id;

        if (!memberId) {
            alert("직원 아이디가 없습니다.");
            return;
        }

        if (
            editForm.status === "WORKING" &&
            !editForm.startTime
        ) {
            alert("출근 시간을 입력해주세요.");
            return;
        }

        if (
            editForm.status === "FINISHED" &&
            (
                !editForm.startTime ||
                !editForm.endTime
            )
        ) {
            alert(
                "출근 시간과 퇴근 시간을 모두 입력해주세요."
            );
            return;
        }

        if (
            editForm.status === "FINISHED" &&
            editForm.endTime < editForm.startTime
        ) {
            alert(
                "퇴근 시간은 출근 시간보다 빠를 수 없습니다."
            );
            return;
        }

        try {
            setSaving(true);
            setMessage("");

            await axios.put(
                `/api/admin/attendance/${memberId}`,
                {
                    workDate: selectedDate,
                    status: editForm.status,

                    startTime:
                        editForm.status === "ABSENT"
                            ? null
                            : editForm.startTime || null,

                    endTime:
                        editForm.status === "FINISHED"
                            ? editForm.endTime || null
                            : null
                },
                {
                    headers
                }
            );

            const memberName =
                attendance.memberName ||
                attendance.name ||
                memberId;

            setMessage(
                `${memberName}님의 근태 정보가 변경되었습니다.`
            );

            cancelEdit();

            await getAttendanceList();
        } catch (error) {
            console.error(
                "근태 변경 실패:",
                error.response?.data || error
            );

            setMessage(
                error.response?.data?.message ||
                (typeof error.response?.data === "string"
                    ? error.response.data
                    : "근태 정보 변경에 실패했습니다.")
            );
        } finally {
            setSaving(false);
        }
    };

    const resetSearch = () => {
        setKeyword("");
        setStatusFilter("ALL");
        setSelectedDate(today);
        cancelEdit();
    };



    return (
        <div className="admin-attendance-page">
            <div className="admin-attendance-container">

                <div className="admin-attendance-header">
                    <div>
                        <p className="admin-attendance-subtitle">
                            OFFICEFLOW ADMIN
                        </p>

                        <h1>근태 관리</h1>

                        <p className="admin-attendance-description">
                            임직원의 출근, 퇴근 및 근태 현황을 관리합니다.
                        </p>
                    </div>

                    <div className="admin-attendance-summary">
                        <div>
                            <span>전체 직원</span>
                            <strong>{totalCount}</strong>
                            <small>명</small>
                        </div>

                        <div>
                            <span>근무 중</span>
                            <strong>{workingCount}</strong>
                            <small>명</small>
                        </div>

                        <div>
                            <span>퇴근</span>
                            <strong>{finishedCount}</strong>
                            <small>명</small>
                        </div>

                        <div>
                            <span>미출근</span>
                            <strong>{absentCount}</strong>
                            <small>명</small>
                        </div>

                        <div>
                            <span>휴가</span>
                            <strong>{vacationCount}</strong>
                            <small>명</small>
                        </div>
                    </div>
                </div>

                {message && (
                    <div className="admin-attendance-message">
                        {message}
                    </div>
                )}

                <div className="admin-attendance-card">

                    <div className="admin-attendance-toolbar">
                        <div className="admin-attendance-search">
                            <input
                                type="text"
                                placeholder="사원명, 아이디 또는 부서 검색"
                                value={keyword}
                                onChange={(event) =>
                                    setKeyword(event.target.value)
                                }
                            />

                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(event.target.value)
                                }
                            >
                                <option value="ALL">
                                    전체 상태
                                </option>

                                <option value="WORKING">
                                    근무 중
                                </option>

                                <option value="FINISHED">
                                    퇴근
                                </option>

                                <option value="ABSENT">
                                    미출근
                                </option>

                                <option value="VACATION">
                                    휴가
                                </option>
                            </select>

                            <input
                                type="date"
                                className="admin-attendance-date-input"
                                value={selectedDate}
                                onChange={(event) => {
                                    setSelectedDate(event.target.value);
                                    cancelEdit();
                                }}
                            />

                            <button
                                type="button"
                                className="admin-attendance-search-reset"
                                onClick={resetSearch}
                            >
                                초기화
                            </button>
                        </div>

                        <button
                            type="button"
                            className="admin-attendance-refresh"
                            onClick={getAttendanceList}
                            disabled={loading || saving}
                        >
                            {loading
                                ? "불러오는 중"
                                : "새로고침"}
                        </button>
                    </div>

                    {loading ? (
                        <div className="admin-attendance-state">
                            <div className="admin-attendance-spinner" />

                            <p>
                                근태 목록을 불러오는 중입니다.
                            </p>
                        </div>
                    ) : filteredList.length === 0 ? (
                        <div className="admin-attendance-state">
                            <div className="admin-attendance-empty-icon">
                                !
                            </div>

                            <h3>근태 내역이 없습니다.</h3>

                            <p>
                                선택한 날짜 또는 검색 조건에 해당하는
                                근태 내역이 없습니다.
                            </p>
                        </div>
                    ) : (
                        <div className="admin-attendance-table-wrapper">
                            <table className="admin-attendance-table">
                                <thead>
                                <tr>
                                    <th>번호</th>
                                    <th>직원</th>
                                    <th>상태</th>
                                    <th>출근 시간</th>
                                    <th>퇴근 시간</th>
                                    <th>근무 시간</th>
                                    <th>관리</th>
                                </tr>
                                </thead>

                                <tbody>
                                {filteredList.map(
                                    (attendance, index) => {
                                        const memberName =
                                            attendance.memberName ||
                                            attendance.name ||
                                            "이름 없음";

                                        const memberId =
                                            attendance.memberId ||
                                            attendance.id ||
                                            "-";

                                        const isEditing =
                                            editingMemberId === memberId;

                                        const startTime =
                                            attendance.startTime;

                                        const endTime =
                                            attendance.endTime;

                                        const workTime =
                                            attendance.workTime ||
                                            attendance.totalWorkTime ||
                                            calculateWorkTime(
                                                startTime,
                                                endTime
                                            );

                                        const statusClassName =
                                            getStatusClassName(
                                                attendance.status
                                            );

                                        const editingWorkTime =
                                            calculateWorkTime(
                                                editForm.startTime,
                                                editForm.endTime
                                            );

                                        return (
                                            <tr
                                                key={
                                                    attendance.attendanceId ||
                                                    attendance.seq ||
                                                    `${memberId}-${index}`
                                                }
                                            >
                                                <td>
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    <div className="admin-attendance-user">
                                                        <div className="admin-attendance-avatar">
                                                            {memberName
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <div className="admin-attendance-user-info">
                                                            <span className="admin-attendance-user-name">
                                                                {memberName}
                                                            </span>

                                                            <span className="admin-attendance-user-id">
                                                                {memberId}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    {isEditing ? (
                                                        <select
                                                            className="admin-attendance-edit-select"
                                                            value={editForm.status}
                                                            onChange={handleStatusChange}
                                                            disabled={saving}
                                                        >
                                                            <option value="ABSENT">
                                                                미출근
                                                            </option>

                                                            <option value="WORKING">
                                                                근무 중
                                                            </option>

                                                            <option value="FINISHED">
                                                                퇴근
                                                            </option>
                                                        </select>
                                                    ) : (
                                                        <span
                                                            className={
                                                                `admin-attendance-status ${statusClassName}`
                                                            }
                                                        >
                                                            {getStatusText(
                                                                attendance.status
                                                            )}
                                                        </span>
                                                    )}
                                                </td>

                                                <td>
                                                    {isEditing ? (
                                                        <input
                                                            type="time"
                                                            className="admin-attendance-edit-time"
                                                            value={editForm.startTime}
                                                            disabled={
                                                                saving ||
                                                                editForm.status === "ABSENT"
                                                            }
                                                            onChange={(event) =>
                                                                setEditForm(
                                                                    (previous) => ({
                                                                        ...previous,
                                                                        startTime:
                                                                        event.target.value
                                                                    })
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <span
                                                            className={
                                                                startTime
                                                                    ? "admin-attendance-time"
                                                                    : "admin-attendance-time empty"
                                                            }
                                                        >
                                                            {formatTime(
                                                                startTime
                                                            )}
                                                        </span>
                                                    )}
                                                </td>

                                                <td>
                                                    {isEditing ? (
                                                        <input
                                                            type="time"
                                                            className="admin-attendance-edit-time"
                                                            value={editForm.endTime}
                                                            disabled={
                                                                saving ||
                                                                editForm.status !== "FINISHED"
                                                            }
                                                            onChange={(event) =>
                                                                setEditForm(
                                                                    (previous) => ({
                                                                        ...previous,
                                                                        endTime:
                                                                        event.target.value
                                                                    })
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <span
                                                            className={
                                                                endTime
                                                                    ? "admin-attendance-time"
                                                                    : "admin-attendance-time empty"
                                                            }
                                                        >
                                                            {formatTime(
                                                                endTime
                                                            )}
                                                        </span>
                                                    )}
                                                </td>

                                                <td>
                                                    <span
                                                        className={
                                                            (
                                                                isEditing
                                                                    ? editingWorkTime
                                                                    : workTime
                                                            ) !== "-"
                                                                ? "admin-attendance-work-time"
                                                                : "admin-attendance-time empty"
                                                        }
                                                    >
                                                        {isEditing
                                                            ? editingWorkTime
                                                            : workTime}
                                                    </span>
                                                </td>

                                                <td>
                                                    {isEditing ? (
                                                        <div className="admin-attendance-edit-actions">
                                                            <button
                                                                type="button"
                                                                className="admin-attendance-save-button"
                                                                onClick={() =>
                                                                    saveAttendance(attendance)
                                                                }
                                                                disabled={saving}
                                                            >
                                                                {saving
                                                                    ? "저장 중"
                                                                    : "저장"}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="admin-attendance-cancel-button"
                                                                onClick={cancelEdit}
                                                                disabled={saving}
                                                            >
                                                                취소
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="admin-attendance-edit-button"
                                                            onClick={() =>
                                                                startEdit(attendance)
                                                            }

                                                        >
                                                            {attendance.status ===
                                                            "VACATION"
                                                                ? "휴가 중"
                                                                : "변경"}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminAttendancePage;