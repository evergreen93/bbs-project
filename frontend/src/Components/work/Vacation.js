import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

function Vacation() {

    const [vacationList, setVacationList] = useState([]);

    const [form, setForm] = useState({
        vacationType: "연차",
        startDate: "",
        endDate: "",
        reason: ""
    });

    const { headers } = useContext(HttpHeadersContext);

    const changeValue = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const getVacationList = async () => {

        try {

            const response = await axios.get(
                "/api/vacation",
                { headers }
            );

            console.log(response.data);

            setVacationList(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    const applyVacation = async () => {

        try {

            const response = await axios.post(
                "/api/vacation",
                form,
                { headers }
            );

            alert("휴가가 신청되었습니다.");

            console.log(response.data);

            setForm({
                vacationType: "연차",
                startDate: "",
                endDate: "",
                reason: ""
            });

            await getVacationList();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ??
                error.response?.data ??
                "휴가 신청에 실패했습니다."
            );

        }

    };

    useEffect(() => {
        getVacationList();
    }, []);

    return (
        <div className="attendance-page">

            <section className="attendance-heading">
                <div>
                    <p className="attendance-eyebrow">VACATION</p>
                    <h1>휴가 신청</h1>
                    <p>연차 및 휴가를 신청합니다.</p>
                </div>
            </section>

            <section className="attendance-summary">

                <div className="attendance-main-card">

                    <div className="mb-3">
                        <label>휴가 종류</label>

                        <select
                            className="form-control"
                            name="vacationType"
                            value={form.vacationType}
                            onChange={changeValue}
                        >
                            <option>연차</option>
                            <option>오전 반차</option>
                            <option>오후 반차</option>
                            <option>병가</option>
                            <option>기타</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label>시작일</label>

                        <input
                            className="form-control"
                            type="date"
                            name="startDate"
                            value={form.startDate}
                            onChange={changeValue}
                        />
                    </div>

                    <div className="mb-3">
                        <label>종료일</label>

                        <input
                            className="form-control"
                            type="date"
                            name="endDate"
                            value={form.endDate}
                            onChange={changeValue}
                        />
                    </div>

                    <div className="mb-3">
                        <label>사유</label>

                        <textarea
                            className="form-control"
                            rows="5"
                            name="reason"
                            value={form.reason}
                            onChange={changeValue}
                        />
                    </div>

                    <button
                        className="attendance-button start"
                        onClick={applyVacation}
                    >
                        휴가 신청
                    </button>

                </div>

            </section>

            <section className="attendance-history-card">
                <div className="attendance-history-header">
                    <div>
                        <p className="attendance-eyebrow">HISTORY</p>
                        <h2>휴가 신청 내역</h2>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table attendance-table">
                        <thead>
                        <tr>
                            <th>휴가 종류</th>
                            <th>시작일</th>
                            <th>종료일</th>
                            <th>사유</th>
                            <th>상태</th>
                        </tr>
                        </thead>

                        <tbody>
                        {vacationList.map((item) => (
                            <tr key={item.vacationId}>
                                <td>{item.vacationType}</td>
                                <td>{item.startDate}</td>
                                <td>{item.endDate}</td>
                                <td>{item.reason || "-"}</td>
                                <td>
                            <span
                                className={
                                    item.status === "승인"
                                        ? "attendance-history-badge normal"
                                        : item.status === "반려"
                                            ? "attendance-history-badge late"
                                            : "attendance-history-badge"
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

export default Vacation;