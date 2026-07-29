import axios from "axios";
import {
	useLocation,
	useNavigate,
	useParams
} from "react-router-dom";
import {
	useContext,
	useEffect,
	useState
} from "react";

import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

import "../../css/bbsform.css";

function BbsAnswer() {
	const { auth } = useContext(AuthContext);
	const { headers } = useContext(HttpHeadersContext);

	const navigate = useNavigate();
	const location = useLocation();

	const { parentSeq } = useParams();

	const parentBbs = location.state?.parentBbs;

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const writerId = localStorage.getItem("id") || auth || "";

	useEffect(() => {
		if (!auth) {
			alert(
				"로그인한 사용자만 게시글에 대한 답글을 작성할 수 있습니다."
			);

			navigate(-1);
			return;
		}

		if (!parentBbs) {
			alert("부모 게시글 정보를 불러올 수 없습니다.");
			navigate("/bbslist");
		}
	}, [auth, navigate, parentBbs]);

	const changeTitle = (event) => {
		setTitle(event.target.value);
	};

	const changeContent = (event) => {
		setContent(event.target.value);
	};

	const createBbsAnswer = async () => {
		const trimmedTitle = title.trim();
		const trimmedContent = content.trim();

		if (!trimmedTitle) {
			alert("답글 제목을 입력해주세요.");
			return;
		}

		if (!trimmedContent) {
			alert("답글 내용을 입력해주세요.");
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
				`/api/bbs/${parentSeq}/answer`,
				req,
				{
					headers
				}
			);

			console.log(
				"[BbsAnswer.js] createBbsAnswer() success"
			);
			console.log(resp.data);

			alert("답글을 성공적으로 등록했습니다.");

			navigate(`/bbsdetail/${resp.data.seq}`);
		} catch (err) {
			console.error(
				"[BbsAnswer.js] createBbsAnswer() error"
			);
			console.error(err);

			const errorMessage =
				err.response?.data?.message ||
				err.response?.data ||
				"답글 등록 중 오류가 발생했습니다.";

			alert(
				typeof errorMessage === "string"
					? errorMessage
					: "답글 등록 중 오류가 발생했습니다."
			);
		} finally {
			setSubmitting(false);
		}
	};

	const cancelAnswer = () => {
		navigate(-1);
	};

	if (!parentBbs) {
		return null;
	}

	return (
		<div className="bbs-form-page">
			<section className="bbs-form-header">
				<div>
					<p className="bbs-form-eyebrow">
						OFFICEFLOW BOARD
					</p>

					<h1>답글 작성</h1>

					<p className="bbs-form-description">
						기존 게시글에 대한 답변이나 의견을
						작성해주세요.
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

			<section className="bbs-parent-card">
				<div className="bbs-parent-card-header">
					<div className="bbs-parent-icon">
						<i className="fas fa-reply" />
					</div>

					<div>
						<h2>답글을 작성할 게시글</h2>
						<p>
							아래 게시글에 연결되는 답글입니다.
						</p>
					</div>
				</div>

				<div className="bbs-parent-information">
					<div className="bbs-parent-information-row">
                        <span className="bbs-parent-label">
                            작성자
                        </span>

						<div className="bbs-parent-writer">
                            <span className="bbs-parent-avatar">
                                {parentBbs.id
									?.charAt(0)
									.toUpperCase() || "U"}
                            </span>

							<strong>{parentBbs.id}</strong>
						</div>
					</div>

					<div className="bbs-parent-information-row">
                        <span className="bbs-parent-label">
                            제목
                        </span>

						<p className="bbs-parent-title">
							{parentBbs.title}
						</p>
					</div>
				</div>
			</section>

			<section className="bbs-form-card">
				<div className="bbs-form-card-header">
					<div className="bbs-form-card-title">
						<div className="bbs-form-card-icon">
							<i className="fas fa-pen" />
						</div>

						<div>
							<h2>답글 내용</h2>
							<p>
								제목과 내용을 입력한 후 등록해주세요.
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
						<label htmlFor="answer-writer">
							작성자
						</label>

						<div className="bbs-readonly-input-wrapper">
							<i className="far fa-user" />

							<input
								id="answer-writer"
								type="text"
								value={writerId}
								readOnly
							/>
						</div>
					</div>

					<div className="bbs-form-group">
						<div className="bbs-form-label-row">
							<label htmlFor="answer-title">
								제목
								<span className="bbs-required-mark">
                                    *
                                </span>
							</label>

							<span className="bbs-character-count">
                                {title.length}자
                            </span>
						</div>

						<input
							id="answer-title"
							type="text"
							className="bbs-form-input"
							placeholder="답글 제목을 입력해주세요."
							value={title}
							onChange={changeTitle}
							maxLength={200}
						/>
					</div>

					<div className="bbs-form-group">
						<div className="bbs-form-label-row">
							<label htmlFor="answer-content">
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
							id="answer-content"
							className="bbs-form-textarea"
							placeholder="답글 내용을 입력해주세요."
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
						onClick={cancelAnswer}
						disabled={submitting}
					>
						취소
					</button>

					<button
						type="button"
						className="bbs-form-submit-button"
						onClick={createBbsAnswer}
						disabled={submitting}
					>
						{submitting ? (
							<>
								<span className="bbs-button-spinner" />
								등록 중
							</>
						) : (
							<>
								<i className="fas fa-reply" />
								답글 등록
							</>
						)}
					</button>
				</div>
			</section>
		</div>
	);
}

export default BbsAnswer;