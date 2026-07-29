import axios from "axios";
import {
	useContext,
	useEffect,
	useState
} from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

import "../../css/bbsform.css";

function BbsWrite() {
	const { auth } = useContext(AuthContext);
	const { headers } = useContext(HttpHeadersContext);

	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const writerId =
		localStorage.getItem("id") || auth || "";

	useEffect(() => {
		if (!auth) {
			alert(
				"로그인한 사용자만 게시글을 작성할 수 있습니다."
			);

			navigate("/login");
		}
	}, [auth, navigate]);

	const changeTitle = (event) => {
		setTitle(event.target.value);
	};

	const changeContent = (event) => {
		setContent(event.target.value);
	};

	/* 게시글 작성 */
	const createBbs = async () => {
		const trimmedTitle = title.trim();
		const trimmedContent = content.trim();

		if (!trimmedTitle) {
			alert("게시글 제목을 입력해주세요.");
			return;
		}

		if (!trimmedContent) {
			alert("게시글 내용을 입력해주세요.");
			return;
		}

		if (submitting) {
			return;
		}

		const req = {
			id: writerId,
			title: trimmedTitle,
			content: trimmedContent
		};

		try {
			setSubmitting(true);

			const resp = await axios.post(
				"/api/bbs",
				req,
				{
					headers
				}
			);

			console.log(
				"[BbsWrite.js] createBbs() success"
			);
			console.log(resp.data);

			if (resp.data?.seq != null) {
				alert(
					"새로운 게시글을 성공적으로 등록했습니다."
				);

				navigate(`/bbsdetail/${resp.data.seq}`);
				return;
			}

			alert("게시글을 등록하지 못했습니다.");
		} catch (err) {
			console.error(
				"[BbsWrite.js] createBbs() error"
			);
			console.error(err);

			const errorMessage =
				err.response?.data?.message ||
				err.response?.data ||
				"게시글 등록 중 오류가 발생했습니다.";

			alert(
				typeof errorMessage === "string"
					? errorMessage
					: "게시글 등록 중 오류가 발생했습니다."
			);
		} finally {
			setSubmitting(false);
		}
	};

	const cancelWrite = () => {
		if (
			title.trim() ||
			content.trim()
		) {
			const confirmed = window.confirm(
				"작성 중인 내용이 있습니다. 작성을 취소하시겠습니까?"
			);

			if (!confirmed) {
				return;
			}
		}

		navigate("/bbslist");
	};

	return (
		<div className="bbs-form-page">
			<section className="bbs-form-header">
				<div>
					<p className="bbs-form-eyebrow">
						OFFICEFLOW BOARD
					</p>

					<h1>새 글 작성</h1>

					<p className="bbs-form-description">
						사내 구성원들과 공유할 소식이나
						의견을 작성해주세요.
					</p>
				</div>

				<button
					type="button"
					className="bbs-form-list-button"
					onClick={() => navigate("/bbslist")}
				>
					<i className="fas fa-list" />
					게시글 목록
				</button>
			</section>

			<section className="bbs-form-card">
				<div className="bbs-form-card-header">
					<div className="bbs-form-card-title">
						<div className="bbs-form-card-icon">
							<i className="fas fa-pen" />
						</div>

						<div>
							<h2>게시글 내용</h2>

							<p>
								제목과 내용을 입력한 후
								등록 버튼을 눌러주세요.
							</p>
						</div>
					</div>

					<span className="bbs-form-required-guide">
                        <i className="fas fa-circle" />
                        필수 입력
                    </span>
				</div>

				<div className="bbs-form-body">
					<div className="bbs-form-group">
						<label htmlFor="write-writer">
							작성자
						</label>

						<div className="bbs-readonly-input-wrapper">
							<i className="far fa-user" />

							<input
								id="write-writer"
								type="text"
								value={writerId}
								readOnly
							/>
						</div>
					</div>

					<div className="bbs-form-group">
						<div className="bbs-form-label-row">
							<label htmlFor="write-title">
								제목
								<span className="bbs-required-mark">
                                    *
                                </span>
							</label>

							<span className="bbs-character-count">
                                {title.length} / 200
                            </span>
						</div>

						<input
							id="write-title"
							type="text"
							className="bbs-form-input"
							placeholder="게시글 제목을 입력해주세요."
							value={title}
							onChange={changeTitle}
							maxLength={200}
							autoFocus
						/>
					</div>

					<div className="bbs-form-group">
						<div className="bbs-form-label-row">
							<label htmlFor="write-content">
								내용
								<span className="bbs-required-mark">
                                    *
                                </span>
							</label>

							<span className="bbs-character-count">
                                {content.length}자
                            </span>
						</div>

						<textarea
							id="write-content"
							className="bbs-form-textarea"
							placeholder="게시글 내용을 입력해주세요."
							value={content}
							onChange={changeContent}
							rows={12}
						/>
					</div>
				</div>

				<div className="bbs-form-actions">
					<button
						type="button"
						className="bbs-form-cancel-button"
						onClick={cancelWrite}
						disabled={submitting}
					>
						취소
					</button>

					<button
						type="button"
						className="bbs-form-submit-button"
						onClick={createBbs}
						disabled={submitting}
					>
						{submitting ? (
							<>
								<span className="bbs-button-spinner" />
								등록 중
							</>
						) : (
							<>
								<i className="fas fa-check" />
								게시글 등록
							</>
						)}
					</button>
				</div>
			</section>
		</div>
	);
}

export default BbsWrite;