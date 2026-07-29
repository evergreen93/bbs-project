import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/adminBoard.css";

function AdminBoardPage() {
    const [boards, setBoards] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);
    const [processingSeq, setProcessingSeq] = useState(null);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("bbs_access_token");

    useEffect(() => {
        getBoardList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getBoardList = async () => {
        try {
            setLoading(true);
            setMessage("");

            const response = await axios.get(
                "/admin/boards",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setBoards(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (error) {
            console.error("게시글 목록 조회 실패", error);

            setMessage(
                error.response?.data?.message ||
                "게시글 목록을 불러오지 못했습니다."
            );
        } finally {
            setLoading(false);
        }
    };

    const deleteBoard = async (board) => {
        const answerMessage =
            board.depth === 0
                ? "이 게시글을 삭제하면 연결된 답글과 댓글도 모두 삭제됩니다."
                : "이 답글이 속한 원글과 답글, 댓글이 모두 삭제됩니다.";

        const confirmed = window.confirm(
            `${answerMessage}\n\n정말 삭제하시겠습니까?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setProcessingSeq(board.seq);
            setMessage("");

            await axios.delete(
                `/admin/boards/${board.seq}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            /*
             * 백엔드가 같은 ref의 원글과 답글을 전부 삭제하므로
             * 화면에서도 같은 ref 게시글을 모두 제거한다.
             */
            setBoards((prevBoards) =>
                prevBoards.filter(
                    (item) => item.ref !== board.ref
                )
            );

            setMessage(
                "게시글과 연결된 답글 및 댓글을 모두 삭제했습니다."
            );
        } catch (error) {
            console.error("관리자 게시글 삭제 실패", error);

            setMessage(
                error.response?.data?.message ||
                "게시글 삭제에 실패했습니다."
            );
        } finally {
            setProcessingSeq(null);
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return date
            .replace("T", " ")
            .substring(0, 16);
    };

    const filteredBoards = boards.filter((board) => {
        const searchKeyword = keyword.trim().toLowerCase();

        if (!searchKeyword) {
            return true;
        }

        const title = board.title || "";
        const writer = board.id || "";
        const content = board.content || "";

        return (
            title.toLowerCase().includes(searchKeyword) ||
            writer.toLowerCase().includes(searchKeyword) ||
            content.toLowerCase().includes(searchKeyword)
        );
    });

    const originalBoardCount = boards.filter(
        (board) => board.depth === 0
    ).length;

    const answerCount = boards.filter(
        (board) => board.depth > 0
    ).length;

    return (
        <div className="admin-board-page">
            <div className="admin-board-container">

                <div className="admin-board-header">
                    <div>
                        <p className="admin-board-subtitle">
                            OFFICEFLOW ADMIN
                        </p>

                        <h1>게시글 관리</h1>

                        <p className="admin-board-description">
                            등록된 게시글을 조회하고 관리합니다.
                        </p>
                    </div>

                    <div className="admin-board-summary">
                        <div>
                            <span>전체</span>
                            <strong>{boards.length}</strong>
                            <small>건</small>
                        </div>

                        <div>
                            <span>원글</span>
                            <strong>{originalBoardCount}</strong>
                            <small>건</small>
                        </div>

                        <div>
                            <span>답글</span>
                            <strong>{answerCount}</strong>
                            <small>건</small>
                        </div>
                    </div>
                </div>

                {message && (
                    <div className="admin-board-message">
                        {message}
                    </div>
                )}

                <div className="admin-board-card">

                    <div className="admin-board-toolbar">
                        <div className="admin-board-search">
                            <input
                                type="text"
                                placeholder="제목, 작성자 또는 내용 검색"
                                value={keyword}
                                onChange={(event) =>
                                    setKeyword(event.target.value)
                                }
                            />

                            {keyword && (
                                <button
                                    type="button"
                                    className="admin-board-search-reset"
                                    onClick={() => setKeyword("")}
                                >
                                    초기화
                                </button>
                            )}
                        </div>

                        <button
                            type="button"
                            className="admin-board-refresh"
                            onClick={getBoardList}
                            disabled={loading}
                        >
                            {loading ? "불러오는 중" : "새로고침"}
                        </button>
                    </div>

                    {loading ? (
                        <div className="admin-board-state">
                            <div className="admin-board-spinner" />
                            <p>게시글 목록을 불러오는 중입니다.</p>
                        </div>
                    ) : filteredBoards.length === 0 ? (
                        <div className="admin-board-state">
                            <div className="admin-board-empty-icon">
                                !
                            </div>

                            <h3>게시글이 없습니다.</h3>

                            <p>
                                검색 조건에 해당하는 게시글이 없습니다.
                            </p>
                        </div>
                    ) : (
                        <div className="admin-board-table-wrapper">
                            <table className="admin-board-table">
                                <thead>
                                <tr>
                                    <th>번호</th>
                                    <th>구분</th>
                                    <th>제목</th>
                                    <th>작성자</th>
                                    <th>작성일</th>
                                    <th>조회수</th>
                                    <th>관리</th>
                                </tr>
                                </thead>

                                <tbody>
                                {filteredBoards.map((board) => {
                                    const isAnswer =
                                        board.depth > 0;

                                    const isProcessing =
                                        processingSeq === board.seq;

                                    return (
                                        <tr key={board.seq}>
                                            <td className="board-seq-cell">
                                                {board.seq}
                                            </td>

                                            <td>
                                                    <span
                                                        className={
                                                            isAnswer
                                                                ? "board-type-answer"
                                                                : "board-type-original"
                                                        }
                                                    >
                                                        {isAnswer
                                                            ? "답글"
                                                            : "원글"}
                                                    </span>
                                            </td>

                                            <td>
                                                <div
                                                    className="admin-board-title-cell"
                                                    style={{
                                                        paddingLeft:
                                                            `${Math.min(
                                                                board.depth || 0,
                                                                4
                                                            ) * 16}px`
                                                    }}
                                                >
                                                    {isAnswer && (
                                                        <span className="answer-arrow">
                                                                ↳
                                                            </span>
                                                    )}

                                                    <span
                                                        className="admin-board-title"
                                                        title={board.title}
                                                    >
                                                            {board.title ||
                                                                "제목 없음"}
                                                        </span>
                                                </div>
                                            </td>

                                            <td>
                                                    <span className="admin-board-writer">
                                                        {board.id || "-"}
                                                    </span>
                                            </td>

                                            <td>
                                                {formatDate(
                                                    board.createdAt
                                                )}
                                            </td>

                                            <td>
                                                {board.readCount || 0}
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="admin-board-delete-button"
                                                    onClick={() =>
                                                        deleteBoard(board)
                                                    }
                                                    disabled={
                                                        isProcessing
                                                    }
                                                >
                                                    {isProcessing
                                                        ? "삭제 중"
                                                        : "삭제"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminBoardPage;