import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

import "../../css/nav.css";

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
		<nav className="office-nav navbar navbar-expand-md sticky-top">
			<div className="container office-nav-container">

				<Link className="office-nav-brand navbar-brand" to="/">
					<span className="office-nav-logo">
						<i className="fas fa-building"></i>
					</span>

					<span className="office-nav-brand-text">
						<strong>OfficeFlow</strong>
						<small>SMART WORKSPACE</small>
					</span>
				</Link>

				<button
					className="navbar-toggler office-nav-toggler"
					type="button"
					data-toggle="collapse"
					data-target="#navbar-content"
					aria-controls="navbar-content"
					aria-expanded="false"
					aria-label="메뉴 열기"
				>
					<span className="office-nav-toggler-line"></span>
					<span className="office-nav-toggler-line"></span>
					<span className="office-nav-toggler-line"></span>
				</button>

				<div
					className="navbar-collapse collapse office-nav-content"
					id="navbar-content"
				>
					<ul className="navbar-nav office-nav-menu">

						<li className="nav-item office-nav-item">
							<Link
								className="nav-link office-nav-link"
								to="/"
							>
								<span className="office-nav-link-icon">
									<i className="fas fa-home"></i>
								</span>
								<span>홈</span>
							</Link>
						</li>

						<li className="nav-item office-nav-item">
							<button
								type="button"
								className="nav-link office-nav-link office-nav-button"
								onClick={() =>
									moveProtectedPage("/dashboard")
								}
							>
								<span className="office-nav-link-icon">
									<i className="fas fa-chart-line"></i>
								</span>
								<span>대시보드</span>
							</button>
						</li>

						<li className="nav-item office-nav-item">
							<Link
								className="nav-link office-nav-link"
								to="/bbslist"
							>
								<span className="office-nav-link-icon">
									<i className="fas fa-clipboard-list"></i>
								</span>
								<span>게시판</span>
							</Link>
						</li>

						<li className="nav-item office-nav-item">
							<button
								type="button"
								className="nav-link office-nav-link office-nav-button"
								onClick={() =>
									moveProtectedPage("/attendance")
								}
							>
								<span className="office-nav-link-icon">
									<i className="fas fa-clock"></i>
								</span>
								<span>근태관리</span>
							</button>
						</li>

						<li className="nav-item office-nav-item">
							<button
								type="button"
								className="nav-link office-nav-link office-nav-button"
								onClick={() =>
									moveProtectedPage("/vacation")
								}
							>
								<span className="office-nav-link-icon">
									<i className="fas fa-calendar-check"></i>
								</span>
								<span>휴가관리</span>
							</button>
						</li>

						{auth && isAdmin && (
							<li className="nav-item office-nav-item">
								<Link
									className="nav-link office-nav-link office-nav-admin-link"
									to="/admin"
								>
									<span className="office-nav-link-icon">
										<i className="fas fa-user-shield"></i>
									</span>
									<span>관리자</span>
								</Link>
							</li>
						)}

					</ul>

					<ul className="navbar-nav office-nav-account">
						{auth ? (
							<>
								<li className="nav-item office-nav-user-item">
									<span className="office-nav-user">
										<span className="office-nav-user-avatar">
											{auth
												? auth.charAt(0).toUpperCase()
												: "U"}
										</span>

										<span className="office-nav-user-info">
											<small>로그인 사용자</small>
											<strong>{auth} 님</strong>
										</span>
									</span>
								</li>

								<li className="nav-item office-nav-account-item">
									<Link
										className="nav-link office-nav-logout"
										to="/logout"
									>
										<i className="fas fa-sign-out-alt"></i>
										<span>로그아웃</span>
									</Link>
								</li>
							</>
						) : (
							<>
								<li className="nav-item office-nav-account-item">
									<Link
										className="nav-link office-nav-login"
										to="/login"
									>
										<i className="fas fa-sign-in-alt"></i>
										<span>로그인</span>
									</Link>
								</li>

								<li className="nav-item office-nav-account-item">
									<Link
										className="nav-link office-nav-join"
										to="/join"
									>
										<i className="fas fa-user-plus"></i>
										<span>회원가입</span>
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