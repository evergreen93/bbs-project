import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/adminMember.css";
import { useContext } from "react";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

function AdminMemberPage() {

    const [members, setMembers] = useState([]);
    const [keyword, setKeyword] = useState("");

    const token = localStorage.getItem("bbs_access_token");

    useEffect(() => {
        getMemberList();
    }, []);

    const getMemberList = async () => {
        try {
            const response = await axios.get("/api/admin/members", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("회원 응답:", response);
            console.log("response 배열 여부:", Array.isArray(response));
            console.log("response.data 배열 여부:", Array.isArray(response?.data));

            const memberList = Array.isArray(response)
                ? response
                : Array.isArray(response?.data)
                    ? response.data
                    : [];

            setMembers(memberList);

        } catch (e) {
            console.error("회원 조회 실패:", e);
            setMembers([]);
        }
    };

    const changeRole = async (member) => {

        if (!window.confirm(`${member.name}님의 권한을 변경하시겠습니까?`)) {
            return;
        }

        try {

            await axios.put(
                `/api/admin/members/${member.id}/role`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            getMemberList();

        } catch (e) {
            console.log(e);
        }
    };

    const deleteMember = async (id) => {

        if (!window.confirm("정말 삭제하시겠습니까?")) {
            return;
        }

        try {

            await axios.delete(
                `/api/admin/members/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            getMemberList();

        } catch (e) {
            console.log(e);
        }
    };

    const filteredMembers = Array.isArray(members)
        ? members.filter(member =>
            String(member?.name ?? "")
                .toLowerCase()
                .includes(keyword.toLowerCase()) ||
            String(member?.id ?? "")
                .toLowerCase()
                .includes(keyword.toLowerCase())
        )
        : [];

    return (

        <div className="admin-member-page">

            <div className="admin-member-container">

                <div className="admin-member-header">

                    <div>

                        <p className="member-subtitle">
                            OFFICEFLOW ADMIN
                        </p>

                        <h1>회원 관리</h1>

                        <p>
                            등록된 회원을 조회하고 관리합니다.
                        </p>

                    </div>

                    <div className="member-count-box">

                        <span>전체 회원</span>

                        <strong>
                            {members.length}
                        </strong>

                        <small>명</small>

                    </div>

                </div>

                <div className="member-card">

                    <div className="member-search">

                        <input
                            type="text"
                            placeholder="이름 또는 아이디 검색"
                            value={keyword}
                            onChange={(e) =>
                                setKeyword(e.target.value)
                            }
                        />

                    </div>

                    <table className="member-table">

                        <thead>

                        <tr>

                            <th>이름</th>

                            <th>아이디</th>

                            <th>이메일</th>

                            <th>권한</th>

                            <th>관리</th>

                        </tr>

                        </thead>

                        <tbody>

                        {filteredMembers.length === 0 ?

                            <tr>

                                <td
                                    colSpan="5"
                                    className="empty-row"
                                >
                                    회원이 없습니다.
                                </td>

                            </tr>

                            :

                            filteredMembers.map(member => (

                                <tr key={member.id}>

                                    <td>{member.name}</td>

                                    <td>{member.id}</td>

                                    <td>{member.email}</td>

                                    <td>

                                        <span
                                            className={
                                                member.role === "ADMIN"
                                                    ? "role-admin"
                                                    : "role-user"
                                            }
                                        >
                                            {member.role}
                                        </span>

                                    </td>

                                    <td>

                                        <button
                                            className="member-role-btn"
                                            onClick={() => changeRole(member)}
                                        >
                                            권한변경
                                        </button>

                                        <button
                                            className="member-delete-btn"
                                            onClick={() => deleteMember(member.id)}
                                        >
                                            삭제
                                        </button>

                                    </td>

                                </tr>

                            ))

                        }

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default AdminMemberPage;