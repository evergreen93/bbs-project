import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
	Link,
	useNavigate,
	useParams
} from "react-router-dom";

import CommentWrite from "../comment/CommentWrite";
import CommentList from "../comment/CommentList";
import { AuthContext } from "../context/AuthProvider";

import "../../css/bbsdetail.css";

function BbsDetail() {
	const { auth } = useContext(AuthContext);

	const { seq } = useParams();
	const navigate = useNavigate();

	const [bbs, setBbs] = useState(null);
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");
	const [deleting, setDeleting] = useState(false);

	const loginId = localStorage.getItem("id");
	const isWriter = Boolean(
		loginId &&
		bbs?.id &&
		loginId === bbs.id
	);

	const getBbsDetail = async () => {
		setLoading(true);
		setErrorMessage("");

		try {
			const resp = await axios.get(`/api/bbs/${seq}`, {
				params: {
					readerId: auth || ""
				}
			});

			console.log(
				"[BbsDetail.js] getBbsDetail() success"
			);
			console.log(resp.data);

			setBbs(resp.data.bbs);
		} catch (err) {
			console.error(
				"[BbsDetail.js] getBbsDetail() error"
			);
			console.error(err);

			setBbs(null);
			setErrorMessage(
				"게시글을 불러오지 못했습니다."
			);
		} finally {
			setLoading(false);
		}
	};

	const deleteBbs = async () => {
		if (deleting) {
			return;
		}

		const confirmed = window.confirm(
			"이 게시글을 삭제하시겠습니까?"
		);

		if (!confirmed) {
			return;
		}

		try {
			setDeleting(true);

			const resp = await axios.delete(
				`/api/bbs/${seq}`
			);

			console.log(
				"[BbsDetail.js] deleteBbs() success"
			);
			console.log(resp.data);

			if (
				Number(resp.data.deletedRecordCount) === 1
			) {
				alert("게시글을 성공적으로 삭제했습니다.");
				navigate("/bbslist");
				return;
			}

			alert("게시글을 삭제하지 못했습니다.");
		} catch (err) {
			console.error(
				"[BbsDetail.js] deleteBbs() error"
			);
			console.error(err);

			const errorMessage =
				err.response?.data?.message ||
				err.response?.data ||
				"게시글 삭제 중 오류가 발생했습니다.";

			alert(
				typeof errorMessage === "string"
					? errorMessage
					: "게시글 삭제 중 오류가 발생했습니다."
			);
		} finally {
			setDeleting(false);
		}
	};

	useEffect(() => {
		getBbsDetail();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [seq, auth]);

	const formatDate = (dateValue) => {
		if (!dateValue) {
			return "-";
		}

		const date = new Date(dateValue);

		if (Number.isNaN(date.getTime())) {
			return dateValue;
		}

		return date.toLocaleString("ko-KR", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit"
		});
	};

	if (loading) {
		return (
			<div className="bbs-detail-page">
				<div className="bbs-detail-status-card">
					<div className="bbs-detail-spinner" />
					<p>게시글을 불러오는 중입니다.</p>
				</div>
			</div>
		);
	}

	if (errorMessage || !bbs) {
		return (
			<div className="bbs-detail-page">
				<div className="bbs-detail-status-card">
					<div className="bbs-detail-error-icon">
						<i className="fas fa-exclamation-circle" />
					</div>

					<h2>게시글을 불러올 수 없습니다.</h2>
					<p>{errorMessage}</p>

					<div className="bbs-detail-error-actions">
						<button
							type="button"
							onClick={getBbsDetail}
						>
							다시 시도
						</button>

						<Link to="/bbslist">
							게시글 목록
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const updateBbs = {
		seq: bbs.seq,
		id: bbs.id,
		title: bbs.title,
		content: bbs.content
	};

	const parentBbs = {
		id: bbs.id,
		title: bbs.title
	};

	return (
		<div className="bbs-detail-page">
			<section className="bbs-detail-header">
				<div>
					<p className="bbs-detail-eyebrow">
						OFFICEFLOW BOARD
					</p>

					<h1>게시글 상세</h1>

					<p className="bbs-detail-description">
						게시글의 내용과 댓글을 확인할 수
						있습니다.
					</p>
				</div>

				<Link
					className="bbs-detail-list-button"
					to="/bbslist"
				>
					<i className="fas fa-list" />
					<span>게시글 목록</span>
				</Link>
			</section>

			<section className="bbs-detail-card">
				<div className="bbs-detail-card-header">
					<div className="bbs-detail-title-area">
						<div className="bbs-detail-category">
							<i className="far fa-clipboard" />
							게시판
						</div>

						<h2>{bbs.title}</h2>

						<div className="bbs-detail-meta">
							<div className="bbs-detail-writer">
								<div className="bbs-detail-avatar">
									{bbs.id
										?.charAt(0)
										.toUpperCase() || "U"}
								</div>

								<div>
                                    <span className="bbs-detail-meta-label">
                                        작성자
                                    </span>

									<strong>{bbs.id}</strong>
								</div>
							</div>

							<span className="bbs-detail-meta-divider" />

							<div className="bbs-detail-meta-item">
								<i className="far fa-clock" />

								<span>
                                    {formatDate(bbs.createdAt)}
                                </span>
							</div>

							<span className="bbs-detail-meta-divider" />

							<div className="bbs-detail-meta-item">
								<i className="far fa-eye" />

								<span>
                                    조회 {bbs.readCount || 0}
                                </span>
							</div>
						</div>
					</div>

					<div className="bbs-detail-actions">
						{auth && (
							<Link
								className="bbs-detail-action-button bbs-detail-reply-button"
								to={`/bbsanswer/${bbs.seq}`}
								state={{
									parentBbs
								}}
							>
								<i className="fas fa-reply" />
								답글쓰기
							</Link>
						)}

						{isWriter && (
							<>
								<Link
									className="bbs-detail-action-button bbs-detail-edit-button"
									to="/bbsupdate"
									state={{
										bbs: updateBbs
									}}
								>
									<i className="fas fa-edit" />
									수정
								</Link>

								<button
									type="button"
									className="bbs-detail-action-button bbs-detail-delete-button"
									onClick={deleteBbs}
									disabled={deleting}
								>
									{deleting ? (
										<>
											<span className="bbs-detail-button-spinner" />
											삭제 중
										</>
									) : (
										<>
											<i className="fas fa-trash-alt" />
											삭제
										</>
									)}
								</button>
							</>
						)}
					</div>
				</div>

				<div className="bbs-detail-content">
					{bbs.content ? (
						<p>{bbs.content}</p>
					) : (
						<p className="bbs-detail-empty-content">
							작성된 내용이 없습니다.
						</p>
					)}
				</div>

				<div className="bbs-detail-card-footer">
					<Link
						className="bbs-detail-bottom-list-button"
						to="/bbslist"
					>
						<i className="fas fa-arrow-left" />
						목록으로 돌아가기
					</Link>
				</div>
			</section>

			<section className="bbs-comment-section">
				<div className="bbs-comment-section-header">
					<div className="bbs-comment-heading">
						<div className="bbs-comment-heading-icon">
							<i className="far fa-comments" />
						</div>

						<div>
							<h2>댓글</h2>
							<p>
								게시글에 대한 의견을
								자유롭게 남겨보세요.
							</p>
						</div>
					</div>
				</div>

				<div className="bbs-comment-section-body">
					{auth ? (
						<div className="bbs-comment-write-area">
							<CommentWrite seq={seq} />
						</div>
					) : (
						<div className="bbs-comment-login-guide">
							<i className="fas fa-lock" />

							<div>
								<strong>
									로그인 후 댓글을 작성할 수
									있습니다.
								</strong>

								<p>
									게시글은 로그인하지 않아도
									확인할 수 있습니다.
								</p>
							</div>
						</div>
					)}

					<div className="bbs-comment-list-area">
						<CommentList seq={seq} />
					</div>
				</div>
			</section>
		</div>
	);
}

export default BbsDetail;