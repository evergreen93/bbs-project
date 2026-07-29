import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { HttpHeadersContext } from "../context/HttpHeadersProvider";

import "../../css/comment.css";

function CommentWrite({ seq, onCommentCreated }) {
	const { headers } = useContext(HttpHeadersContext);

	const navigate = useNavigate();

	const id = localStorage.getItem("id") || "";

	const [content, setContent] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const changeContent = (event) => {
		setContent(event.target.value);
	};

	const createComment = async () => {
		const trimmedContent = content.trim();

		if (!trimmedContent) {
			alert("댓글 내용을 입력해주세요.");
			return;
		}

		if (submitting) {
			return;
		}

		const req = {
			id,
			content: trimmedContent,
			bbsSeq: seq
		};

		try {
			setSubmitting(true);

			const resp = await axios.post(
				"/api/comment",
				req,
				{
					params: {
						bbsSeq: seq
					},
					headers
				}
			);

			console.log(
				"[CommentWrite.js] createComment() success"
			);
			console.log(resp.data);

			if (resp.data?.seq != null) {
				setContent("");

				alert("댓글을 성공적으로 등록했습니다.");

				if (typeof onCommentCreated === "function") {
					onCommentCreated();
				} else {
					navigate(0);
				}

				return;
			}

			alert("댓글을 등록하지 못했습니다.");
		} catch (err) {
			console.error(
				"[CommentWrite.js] createComment() error"
			);
			console.error(err);

			const errorMessage =
				err.response?.data?.message ||
				err.response?.data ||
				"댓글 등록 중 오류가 발생했습니다.";

			alert(
				typeof errorMessage === "string"
					? errorMessage
					: "댓글 등록 중 오류가 발생했습니다."
			);
		} finally {
			setSubmitting(false);
		}
	};

	const handleKeyDown = (event) => {
		if (
			event.key === "Enter" &&
			(event.ctrlKey || event.metaKey)
		) {
			event.preventDefault();
			createComment();
		}
	};

	return (
		<section className="comment-write-container">
			<div className="comment-write-header">
				<div className="comment-write-user">
					<div className="comment-write-avatar">
						{id.charAt(0).toUpperCase() || "U"}
					</div>

					<div>
						<strong>{id}</strong>

						<span>댓글 작성</span>
					</div>
				</div>

				<span className="comment-write-guide">
                    Ctrl + Enter로 등록
                </span>
			</div>

			<div className="comment-write-input-wrapper">
                <textarea
					value={content}
	                onChange={changeContent}
	                onKeyDown={handleKeyDown}
	                rows={5}
	                maxLength={1000}
	                placeholder="게시글에 대한 의견을 남겨주세요."
	                disabled={submitting}
				/>

				<span className="comment-write-character-count">
                    {content.length} / 1000
                </span>
			</div>

			<div className="comment-write-footer">
				<p>
					<i className="fas fa-info-circle" />
					상대방을 배려하는 댓글을 작성해주세요.
				</p>

				<button
					type="button"
					className="comment-write-submit-button"
					onClick={createComment}
					disabled={
						submitting || !content.trim()
					}
				>
					{submitting ? (
						<>
							<span className="comment-write-spinner" />
							등록 중
						</>
					) : (
						<>
							<i className="far fa-comment-dots" />
							댓글 등록
						</>
					)}
				</button>
			</div>
		</section>
	);
}

export default CommentWrite;