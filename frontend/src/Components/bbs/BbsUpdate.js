import axios from "axios";
import {
	useContext,
	useEffect,
	useState
} from "react";
import {
	useLocation,
	useNavigate
} from "react-router-dom";

import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

import "../../css/bbsform.css";

function BbsUpdate() {
	const { headers } = useContext(HttpHeadersContext);
	const { auth } = useContext(AuthContext);

	const navigate = useNavigate();
	const location = useLocation();

	const bbs = location.state?.bbs;

	const [title, setTitle] = useState(
		bbs?.title || ""
	);

	const [content, setContent] = useState(
		bbs?.content || ""
	);

	const [submitting, setSubmitting] =
		useState(false);

	const loginId =
		localStorage.getItem("id") || auth || "";

	useEffect(() => {
		if (!auth) {
			alert(
				"로그인한 사용자만 게시글을 수정할 수 있습니다."
			);

			navigate("/login");
			return;
		}

		if (!bbs) {
			alert("수정할 게시글 정보를 찾을 수 없습니다.");
			navigate("/bbslist");
			return;
		}

		if (loginId !== bbs.id) {
			alert(
				"자신이 작성한 게시글만 수정할 수 있습니다."
			);

			navigate(`/bbsdetail/${bbs.seq}`);
		}
	}, [auth, bbs, loginId, navigate]);

	const changeTitle = (event) => {
		setTitle(event.target.value);
	};

	const changeContent = (event) => {
		setContent(event.target.value);
	};

	const updateBbs = async () => {
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

		if (submitting || !bbs) {
			return;
		}

		const req = {
			id: loginId,
			title: trimmedTitle,
			content: trimmedContent
		};

		try {
			setSubmitting(true);

			const resp = await axios.patch(
				`/api/bbs/${bbs.seq}`,
				req,
				{
					headers
				}
			);

			console.log(
				"[BbsUpdate.js] updateBbs() success"
			);
			console.log(resp.data);

			if (
				Number(resp.data.updatedRecordCount) === 1
			) {
				alert(
					"게시글을 성공적으로 수정했습니다."
				);

				navigate(`/bbsdetail/${bbs.seq}`);
				return;
			}

			alert("게시글을 수정하지 못했습니다.");
		} catch (err) {
			console.error(
				"[BbsUpdate.js] updateBbs() error"
			);
			console.error(err);

			const errorMessage =
				err.response?.data?.message ||
				err.response?.data ||
				"게시글 수정 중 오류가 발생했습니다.";

			alert(
				typeof errorMessage === "string"
					? errorMessage
					: "게시글 수정 중 오류가 발생했습니다."
			);
		} finally {
			setSubmitting(false);
		}
	};

	const cancelUpdate = () => {
		if (!bbs) {
			navigate("/bbslist");
			return;
		}

		navigate(`/bbsdetail/${bbs.seq}`);
	};

	if (!bbs) {
		return null;
	}

	return (
		<div className="bbs-form-page">
			<section className="bbs-form-header">
				<div>
					<p className="bbs-form-eyebrow">
						OFFICEFLOW BOARD
					</p>

					<h1>게시글 수정</h1>

					<p className="bbs-form-description">
						작성한 게시글의 제목과 내용을
						수정할 수 있습니다.
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
							<i className="fas fa-edit" />
						</div>

						<div>
							<h2>게시글 내용 수정</h2>

							<p>
								변경할 내용을 입력한 후
								수정 버튼을 눌러주세요.
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
						<label htmlFor="update-writer">
							작성자
						</label>

						<div className="bbs-readonly-input-wrapper">
							<i className="far fa-user" />

							<input
								id="update-writer"
								type="text"
								value={bbs.id}
								readOnly
							/>
						</div>
					</div>

					<div className="bbs-form-group">
						<div className="bbs-form-label-row">
							<label htmlFor="update-title">
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
							id="update-title"
							type="text"
							className="bbs-form-input"
							placeholder="게시글 제목을 입력해주세요."
							value={title}
							onChange={changeTitle}
							maxLength={200}
						/>
					</div>

					<div className="bbs-form-group">
						<div className="bbs-form-label-row">
							<label htmlFor="update-content">
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
							id="update-content"
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
						onClick={cancelUpdate}
						disabled={submitting}
					>
						취소
					</button>

					<button
						type="button"
						className="bbs-form-submit-button"
						onClick={updateBbs}
						disabled={submitting}
					>
						{submitting ? (
							<>
								<span className="bbs-button-spinner" />
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
			</section>
		</div>
	);
}

export default BbsUpdate;