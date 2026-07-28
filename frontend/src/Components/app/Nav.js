import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

function Nav() {
	const { auth } = useContext(AuthContext);
	const navigate = useNavigate();

	const role = localStorage.getItem("role");
	const isAdmin = role === "ADMIN" || role === "ROLE_ADMIN";

	const moveProtectedPage = (path) => {
		if (!auth) {
			alert("로그인 후 사용할 수 있습니다.");
			navigate("/login");
			return;
		}

		navigate(path);
	};

	return (
		<nav className="navbar navbar-expand-md navbar-dark bg-dark sticky-top">
			<div className="container">

				<Link className="navbar-brand font-weight-bold" to="/">
					<i className="fas fa-building"></i> OfficeFlow
				</Link>

				<button
					className="navbar-toggler"
					type="button"
					data-toggle="collapse"
					data-target="#navbar-content"
					aria-controls="navbar-content"
					aria-expanded="false"
					aria-label="메뉴 열기"
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div
					className="navbar-collapse collapse justify-content-between"
					id="navbar-content"
				>
					<ul className="navbar-nav mr-auto">

						<li className="nav-item">
							<Link className="nav-link" to="/">
								<i className="fas fa-home"></i> 홈
							</Link>
						</li>

						<li className="nav-item">
							<button
								type="button"
								className="nav-link btn btn-link"
								onClick={() =>
									moveProtectedPage("/dashboard")
								}
								style={{
									border: "none",
									background: "none"
								}}
							>
								<i className="fas fa-chart-line"></i>{" "}
								대시보드
							</button>
						</li>

						<li className="nav-item">
							<Link className="nav-link" to="/bbslist">
								<i className="fas fa-clipboard-list"></i>{" "}
								게시판
							</Link>
						</li>

						<li className="nav-item">
							<button
								type="button"
								className="nav-link btn btn-link"
								onClick={() =>
									moveProtectedPage("/attendance")
								}
								style={{
									border: "none",
									background: "none"
								}}
							>
								<i className="fas fa-clock"></i>{" "}
								근태관리
							</button>
						</li>

						<li className="nav-item">
							<button
								type="button"
								className="nav-link btn btn-link"
								onClick={() =>
									moveProtectedPage("/vacation")
								}
								style={{
									border: "none",
									background: "none"
								}}
							>
								<i className="fas fa-calendar-check"></i>{" "}
								휴가관리
							</button>
						</li>

						{auth && isAdmin && (
							<li className="nav-item">
								<Link className="nav-link" to="/admin">
									<i className="fas fa-user-shield"></i>{" "}
									관리자
								</Link>
							</li>
						)}

					</ul>

					<ul className="navbar-nav ml-auto">
						{auth ? (
							<>
								<li className="nav-item">
									<span className="nav-link">
										<i className="fas fa-user"></i>{" "}
										{auth} 님
									</span>
								</li>

								<li className="nav-item">
									<Link
										className="nav-link"
										to="/logout"
									>
										<i className="fas fa-sign-out-alt"></i>{" "}
										로그아웃
									</Link>
								</li>
							</>
						) : (
							<>
								<li className="nav-item">
									<Link
										className="nav-link"
										to="/login"
									>
										<i className="fas fa-sign-in-alt"></i>{" "}
										로그인
									</Link>
								</li>

								<li className="nav-item">
									<Link
										className="nav-link"
										to="/join"
									>
										<i className="fas fa-user-plus"></i>{" "}
										회원가입
									</Link>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
}

export default Nav;