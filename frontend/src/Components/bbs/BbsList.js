import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";

import "../../css/bbslist.css";
import "../../css/page.css";

const ITEMS_PER_PAGE = 10;

function BbsList() {
	const [bbsList, setBbsList] = useState([]);

	const [choiceVal, setChoiceVal] = useState("");
	const [searchVal, setSearchVal] = useState("");

	const [page, setPage] = useState(1);
	const [totalCnt, setTotalCnt] = useState(0);

	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	/* 게시글 목록 조회 */
	const getBbsList = async (
		choice = choiceVal,
		search = searchVal,
		selectedPage = page
	) => {
		setLoading(true);
		setErrorMessage("");

		try {
			const resp = await axios.get("/api/bbs", {
				params: {
					choice,
					search,
					page: selectedPage
				}
			});

			console.log("[BbsList.js] getBbsList() success");
			console.log(resp.data);

			setBbsList(resp.data.bbsList || []);
			setTotalCnt(resp.data.pageCnt || 0);
		} catch (err) {
			console.error("[BbsList.js] getBbsList() error");
			console.error(err);

			setBbsList([]);
			setTotalCnt(0);
			setErrorMessage("게시글을 불러오지 못했습니다.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getBbsList("", "", 1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const changeChoice = (event) => {
		setChoiceVal(event.target.value);
	};

	const changeSearch = (event) => {
		setSearchVal(event.target.value);
	};

	const search = () => {
		const trimmedSearch = searchVal.trim();

		setPage(1);
		getBbsList(choiceVal, trimmedSearch, 1);
	};

	const handleSearchKeyDown = (event) => {
		if (event.key === "Enter") {
			search();
		}
	};

	const resetSearch = () => {
		setChoiceVal("");
		setSearchVal("");
		setPage(1);

		getBbsList("", "", 1);
	};

	const changePage = (selectedPage) => {
		setPage(selectedPage);
		getBbsList(choiceVal, searchVal.trim(), selectedPage);

		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};

	return (
		<div className="bbs-list-page">
			<section className="bbs-list-header">
				<div>
					<p className="bbs-list-eyebrow">OFFICEFLOW BOARD</p>

					<h1>사내 게시판</h1>

					<p className="bbs-list-description">
						사내 소식과 다양한 의견을 자유롭게 공유해보세요.
					</p>
				</div>

				<Link className="bbs-write-button" to="/bbswrite">
					<i className="fas fa-pen" />
					<span>새 글 작성</span>
				</Link>
			</section>

			<section className="bbs-search-card">
				<div className="bbs-search-heading">
					<div className="bbs-search-icon">
						<i className="fas fa-search" />
					</div>

					<div>
						<h2>게시글 검색</h2>
						<p>제목, 내용 또는 작성자로 게시글을 찾아보세요.</p>
					</div>
				</div>

				<div className="bbs-search-form">
					<div className="bbs-search-select-wrapper">
						<select
							className="bbs-search-select"
							value={choiceVal}
							onChange={changeChoice}
							aria-label="검색 조건"
						>
							<option value="">전체</option>
							<option value="title">제목</option>
							<option value="content">내용</option>
							<option value="writer">작성자</option>
						</select>

						<i className="fas fa-chevron-down" />
					</div>

					<div className="bbs-search-input-wrapper">
						<i className="fas fa-search" />

						<input
							type="text"
							className="bbs-search-input"
							placeholder="검색어를 입력하세요"
							value={searchVal}
							onChange={changeSearch}
							onKeyDown={handleSearchKeyDown}
						/>
					</div>

					<button
						type="button"
						className="bbs-search-button"
						onClick={search}
					>
						검색
					</button>

					{(choiceVal || searchVal) && (
						<button
							type="button"
							className="bbs-search-reset-button"
							onClick={resetSearch}
							title="검색 초기화"
						>
							<i className="fas fa-redo-alt" />
							초기화
						</button>
					)}
				</div>
			</section>

			<section className="bbs-list-card">
				<div className="bbs-list-card-header">
					<div>
						<h2>
							<i className="far fa-clipboard" />
							게시글 목록
						</h2>

						<p>
							총 <strong>{totalCnt}</strong>개의 게시글이 있습니다.
						</p>
					</div>
				</div>

				<div className="bbs-table-wrapper">
					<table className="bbs-table">
						<thead>
						<tr>
							<th className="bbs-number-column">번호</th>
							<th>제목</th>
							<th className="bbs-writer-column">작성자</th>
						</tr>
						</thead>

						<tbody>
						{loading ? (
							<tr>
								<td colSpan="3">
									<div className="bbs-status-box">
										<div className="bbs-loading-spinner" />
										<p>게시글을 불러오는 중입니다.</p>
									</div>
								</td>
							</tr>
						) : errorMessage ? (
							<tr>
								<td colSpan="3">
									<div className="bbs-status-box bbs-error-box">
										<i className="fas fa-exclamation-circle" />
										<p>{errorMessage}</p>

										<button
											type="button"
											onClick={() =>
												getBbsList(
													choiceVal,
													searchVal,
													page
												)
											}
										>
											다시 시도
										</button>
									</div>
								</td>
							</tr>
						) : bbsList.length === 0 ? (
							<tr>
								<td colSpan="3">
									<div className="bbs-status-box bbs-empty-box">
										<div className="bbs-empty-icon">
											<i className="far fa-file-alt" />
										</div>

										<h3>등록된 게시글이 없습니다.</h3>
										<p>
											첫 번째 게시글을 작성해보세요.
										</p>
									</div>
								</td>
							</tr>
						) : (
							bbsList.map((bbs, idx) => (
								<TableRow
									key={bbs.seq}
									bbs={bbs}
									number={
										(page - 1) * ITEMS_PER_PAGE +
										idx +
										1
									}
								/>
							))
						)}
						</tbody>
					</table>
				</div>

				{!loading && !errorMessage && totalCnt > 0 && (
					<div className="bbs-pagination-wrapper">
						<Pagination
							activePage={page}
							itemsCountPerPage={ITEMS_PER_PAGE}
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
			</section>

			<div className="bbs-mobile-write-area">
				<Link className="bbs-write-button" to="/bbswrite">
					<i className="fas fa-pen" />
					<span>새 글 작성</span>
				</Link>
			</div>
		</div>
	);
}

/* 게시글 목록 행 */
function TableRow({ bbs, number }) {
	const isDeleted = Number(bbs.del) !== 0;
	const depth = Number(bbs.depth) || 0;

	return (
		<tr className={isDeleted ? "bbs-deleted-row" : ""}>
			<td className="bbs-number-cell">{number}</td>

			<td className="bbs-title-cell">
				<div
					className="bbs-title-content"
					style={{
						paddingLeft: `${Math.min(depth, 6) * 24}px`
					}}
				>
					{depth > 0 && (
						<span className="bbs-reply-marker">
                            <i className="fas fa-level-up-alt" />
                            <span>답글</span>
                        </span>
					)}

					{isDeleted ? (
						<span className="bbs-deleted-message">
                            <i className="fas fa-exclamation-triangle" />
                            작성자에 의해 삭제된 게시글입니다.
                        </span>
					) : (
						<Link
							className="bbs-title-link"
							to={`/bbsdetail/${bbs.seq}`}
						>
							<span>{bbs.title}</span>
							<i className="fas fa-chevron-right" />
						</Link>
					)}
				</div>
			</td>

			<td className="bbs-writer-cell">
				{!isDeleted && (
					<div className="bbs-writer">
						<div className="bbs-writer-avatar">
							{bbs.id
								? bbs.id.charAt(0).toUpperCase()
								: "U"}
						</div>

						<span>{bbs.id}</span>
					</div>
				)}
			</td>
		</tr>
	);
}

export default BbsList;