import axios from "axios";
import { useContext, useState } from "react";

import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

import "../../css/comment.css";

/* 댓글 컴포넌트 */
function Comment({ obj: comment }) {
	const { auth } = useContext(AuthContext);
	const { headers } = useContext(HttpHeadersContext);

	const [isEditing, setIsEditing] = useState(false);
	const [content, setContent] = useState(
		comment.content || ""
	);

	const [savedContent, setSavedContent] = useState(
		comment.content || ""
	);

	const [isDeleted, setIsDeleted] = useState(
		Number(comment.del) !== 0
	);

	const [updating, setUpdating] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const loginId =
		localStorage.getItem("id") || auth || "";

	const isWriter =
		Boolean(loginId) && loginId === comment.id;

	const changeContent = (event) => {
		setContent(event.target.value);
	};

	const formatDate = (dateValue) => {
		if (!dateValue) {
			return "";
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

	const openUpdate = () => {
		setContent(savedContent);
		setIsEditing(true);
	};

	const cancelUpdate = () => {
		setContent(savedContent);
		setIsEditing(false);
	};

	/* 댓글 수정 */
	const updateComment = async () => {
		const trimmedContent = content.trim();

		if (!trimmedContent) {
			alert("댓글 내용을 입력해주세요.");
			return;
		}

		if (updating) {
			return;
		}

		const req = {
			content: trimmedContent
		};

		try {
			setUpdating(true);

			const resp = await axios.patch(
				`/api/comment/${comment.seq}`,
				req,
				{
					headers
				}
			);

			console.log(
				"[Comment.js] updateComment() success"
			);
			console.log(resp.data);

			setSavedContent(trimmedContent);
			setContent(trimmedContent);
			setIsEditing(false);

			alert("댓글을 성공적으로 수정했습니다.");
		} catch (err) {
			console.error(
				"[Comment.js] updateComment() error"
			);
			console.error(err);

			const errorMessage =
				err.response?.data?.message ||
				err.response?.data ||
				"댓글 수정 중 오류가 발생했습니다.";

			alert(
				typeof errorMessage === "string"
					? errorMessage
					: "댓글 수정 중 오류가 발생했습니다."
			);
		} finally {
			setUpdating(false);
		}
	};

	/* 댓글 삭제 */
	const deleteComment = async () => {
		if (deleting) {
			return;
		}

		const confirmed = window.confirm(
			"이 댓글을 삭제하시겠습니까?"
		);

		if (!confirmed) {
			return;
		}

		try {
			setDeleting(true);

			const resp = await axios.delete(
				`/api/comment/${comment.seq}`,
				{
					headers
				}
			);

			console.log(
				"[Comment.js] deleteComment() success"
			);
			console.log(resp.data);

			if (
				Number(resp.data.deletedRecordCount) === 1
			) {
				setIsDeleted(true);
				setIsEditing(false);

				alert("댓글을 성공적으로 삭제했습니다.");
				return;
			}

			alert("댓글을 삭제하지 못했습니다.");
		} catch (err) {
			console.error(
				"[Comment.js] deleteComment() error"
			);
			console.error(err);

			const errorMessage =
				err.response?.data?.message ||
				err.response?.data ||
				"댓글 삭제 중 오류가 발생했습니다.";

			alert(
				typeof errorMessage === "string"
					? errorMessage
					: "댓글 삭제 중 오류가 발생했습니다."
			);
		} finally {
			setDeleting(false);
		}
	};

	if (isDeleted) {
		return (
			<article className="comment-item comment-deleted-item">
				<div className="comment-deleted-icon">
					<i className="fas fa-comment-slash" />
				</div>

				<span>
                    작성자에 의해 삭제된 댓글입니다.
                </span>
			</article>
		);
	}

	return (
		<article className="comment-item">
			<div className="comment-profile">
				<div className="comment-profile-avatar">
					{comment.id
						?.charAt(0)
						.toUpperCase() || "U"}
				</div>
			</div>

			<div className="comment-main">
				<div className="comment-header">
					<div className="comment-writer-info">
						<div className="comment-writer-name">
							<strong>{comment.id}</strong>

							{isWriter && (
								<span className="comment-writer-badge">
                                    내 댓글
                                </span>
							)}
						</div>

						<span className="comment-created-at">
                            <i className="far fa-clock" />
							{formatDate(comment.createdAt)}
                        </span>
					</div>

					{isWriter && !isEditing && (
						<div className="comment-actions">
							<button
								type="button"
								className="comment-action-button comment-edit-button"
								onClick={openUpdate}
								disabled={deleting}
							>
								<i className="fas fa-edit" />
								수정
							</button>

							<button
								type="button"
								className="comment-action-button comment-delete-button"
								onClick={deleteComment}
								disabled={deleting}
							>
								{deleting ? (
									<>
										<span className="comment-button-spinner" />
										삭제 중
									</>
								) : (
									<>
										<i className="fas fa-trash-alt" />
										삭제
									</>
								)}
							</button>
						</div>
					)}
				</div>

				{isEditing ? (
					<div className="comment-update-area">
						<div className="comment-update-textarea-wrapper">
                            <textarea
								value={content}
	                            onChange={changeContent}
	                            rows={5}
	                            maxLength={1000}
	                            placeholder="댓글 내용을 입력해주세요."
	                            autoFocus
							/>

							<span className="comment-character-count">
                                {content.length} / 1000
                            </span>
						</div>

						<div className="comment-update-actions">
							<button
								type="button"
								className="comment-cancel-button"
								onClick={cancelUpdate}
								disabled={updating}
							>
								취소
							</button>

							<button
								type="button"
								className="comment-save-button"
								onClick={updateComment}
								disabled={updating}
							>
								{updating ? (
									<>
										<span className="comment-save-spinner" />
										수정 중
									</>
								) : (
									<>
										<i className="fas fa-check" />
										수정 완료
									</>
								)}
							</button>
						</div>
					</div>
				) : (
					<div className="comment-content">
						{savedContent}
					</div>
				)}
			</div>
		</article>
	);
}

export default Comment;