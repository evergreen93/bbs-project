import axios from "axios";
import {
	useEffect,
	useRef,
	useState
} from "react";
import Pagination from "react-js-pagination";

import Comment from "./Comment";

import "../../css/comment.css";

function CommentList({ seq }) {
	const listTopRef = useRef(null);

	const [page, setPage] = useState(1);
	const [totalCnt, setTotalCnt] = useState(0);
	const [commentList, setCommentList] = useState([]);

	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");

	const getCommentList = async (
		targetPage = 1,
		scrollToTop = false
	) => {
		try {
			setLoading(true);
			setErrorMessage("");

			const resp = await axios.get("/api/comment", {
				params: {
					bbsSeq: seq,
					page: targetPage
				}
			});

			console.log(
				"[CommentList.js] getCommentList() success"
			);
			console.log(resp.data);

			const comments = Array.isArray(
				resp.data.commentList
			)
				? resp.data.commentList
				: [];

			setCommentList(comments);
			setTotalCnt(
				Number(resp.data.pageCnt) || 0
			);
			setPage(targetPage);

			if (scrollToTop) {
				requestAnimationFrame(() => {
					listTopRef.current?.scrollIntoView({
						behavior: "smooth",
						block: "start"
					});
				});
			}
		} catch (err) {
			console.error(
				"[CommentList.js] getCommentList() error"
			);
			console.error(err);

			setCommentList([]);
			setTotalCnt(0);
			setErrorMessage(
				"댓글 목록을 불러오지 못했습니다."
			);
		} finally {
			setLoading(false);
		}
	};

	const changePage = (selectedPage) => {
		if (selectedPage === page || loading) {
			return;
		}

		getCommentList(selectedPage, true);
	};

	useEffect(() => {
		if (!seq) {
			return;
		}

		setPage(1);
		getCommentList(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [seq]);

	return (
		<div
			className="comment-list-container"
			ref={listTopRef}
		>
			<div className="comment-list-header">
				<div>
					<h3>
						<i className="fas fa-paperclip" />
						댓글 목록
					</h3>

					<p>
						게시글에 등록된 댓글을 확인할 수
						있습니다.
					</p>
				</div>

				<span className="comment-list-count">
                    총 {totalCnt}개
                </span>
			</div>

			{loading ? (
				<div className="comment-list-status">
					<div className="comment-list-spinner" />

					<p>댓글을 불러오는 중입니다.</p>
				</div>
			) : errorMessage ? (
				<div className="comment-list-status">
					<div className="comment-list-error-icon">
						<i className="fas fa-exclamation-circle" />
					</div>

					<strong>
						댓글을 불러올 수 없습니다.
					</strong>

					<p>{errorMessage}</p>

					<button
						type="button"
						className="comment-list-retry-button"
						onClick={() =>
							getCommentList(page)
						}
					>
						<i className="fas fa-redo" />
						다시 시도
					</button>
				</div>
			) : commentList.length === 0 ? (
				<div className="comment-list-empty">
					<div className="comment-list-empty-icon">
						<i className="far fa-comment-dots" />
					</div>

					<strong>
						아직 등록된 댓글이 없습니다.
					</strong>

					<p>
						첫 번째 댓글을 작성해보세요.
					</p>
				</div>
			) : (
				<>
					<div className="comment-list">
						{commentList.map((comment) => (
							<Comment
								key={
									comment.seq ??
									`${comment.id}-${comment.createdAt}`
								}
								obj={comment}
							/>
						))}
					</div>

					{totalCnt > 5 && (
						<div className="comment-pagination">
							<Pagination
								activePage={page}
								itemsCountPerPage={5}
								totalItemsCount={totalCnt}
								pageRangeDisplayed={5}
								prevPageText="‹"
								nextPageText="›"
								firstPageText="«"
								lastPageText="»"
								onChange={changePage}
							/>
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default CommentList;