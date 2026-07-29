/* 로그인 컴포넌트 */

import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

import "../../css/login.css";


function Login() {

	const { setAuth } = useContext(AuthContext);
	const { setHeaders } = useContext(HttpHeadersContext);

	const navigate = useNavigate();

	const [id, setId] = useState("");
	const [pwd, setPwd] = useState("");

	const changeId = (event) => {
		setId(event.target.value);
	};

	const changePwd = (event) => {
		setPwd(event.target.value);
	};

	const login = async () => {

		const req = {
			id: id,
			pwd: pwd
		};

		await axios.post("/api/user/login", req)
			.then((resp) => {
				console.log("[Login.js] login() success :D");
				console.log(resp.data);

				alert(
					resp.data.id +
					"님, 성공적으로 로그인 되었습니다 🔐"


				);
				localStorage.setItem("bbs_access_token", resp.data.jwt);
				localStorage.setItem("id", resp.data.id);
				localStorage.setItem("role", resp.data.role);

				console.log("저장된 토큰:", localStorage.getItem("bbs_access_token"));
				console.log("저장된 role:", localStorage.getItem("role"));

				localStorage.setItem(
					"bbs_access_token",
					resp.data.jwt
				);

				localStorage.setItem(
					"id",
					resp.data.id
				);

				localStorage.setItem(
					"role",
					resp.data.role
				);

				setAuth(resp.data.id);

				setHeaders({
					Authorization: `Bearer ${resp.data.jwt}`
				});

				navigate("/bbslist");
			})
			.catch((err) => {
				console.log("[Login.js] login() error :<");
				console.log(err);

				alert(
					"⚠️ " +
					(err.response?.data || "로그인에 실패했습니다.")
				);
			});
	};

	return (
		<main className="login-page">
			<div className="login-background-decoration login-decoration-one"></div>
			<div className="login-background-decoration login-decoration-two"></div>

			<section className="login-container">
				<div className="login-intro">
					<div className="login-brand">
						<div className="login-brand-icon">
							<i className="fas fa-building"></i>
						</div>

						<div>
							<p className="login-brand-name">OFFICEFLOW</p>
							<span className="login-brand-caption">
								Smart Work Management
							</span>
						</div>
					</div>

					<div className="login-intro-content">
						<span className="login-intro-badge">
							WORKSPACE
						</span>

						<h1>
							업무와 소통을
							<br />
							하나의 공간에서
						</h1>

						<p>
							근태 관리부터 휴가 신청, 사내 게시판까지
							<br />
							OFFICEFLOW에서 편리하게 관리하세요.
						</p>
					</div>

					<div className="login-feature-list">
						<div className="login-feature-item">
							<div className="login-feature-icon">
								<i className="far fa-clock"></i>
							</div>

							<div>
								<strong>간편한 근태 관리</strong>
								<span>출퇴근 현황을 빠르게 확인하세요.</span>
							</div>
						</div>

						<div className="login-feature-item">
							<div className="login-feature-icon">
								<i className="far fa-calendar-check"></i>
							</div>

							<div>
								<strong>휴가 신청 및 승인</strong>
								<span>휴가 업무를 한곳에서 처리하세요.</span>
							</div>
						</div>

						<div className="login-feature-item">
							<div className="login-feature-icon">
								<i className="far fa-comments"></i>
							</div>

							<div>
								<strong>사내 커뮤니케이션</strong>
								<span>게시판을 통해 소식을 공유하세요.</span>
							</div>
						</div>
					</div>
				</div>

				<div className="login-form-area">
					<div className="login-form-card">
						<div className="login-form-heading">
							<span className="login-form-eyebrow">
								WELCOME BACK
							</span>

							<h2>로그인</h2>

							<p>
								OFFICEFLOW 계정으로 로그인해주세요.
							</p>
						</div>

						<div className="login-form">
							<div className="login-input-group">
								<label htmlFor="login-id">
									아이디
								</label>

								<div className="login-input-wrapper">
									<i className="far fa-user"></i>

									<input
										id="login-id"
										type="text"
										value={id}
										onChange={changeId}
										placeholder="아이디를 입력해주세요"
										autoComplete="username"
									/>
								</div>
							</div>

							<div className="login-input-group">
								<label htmlFor="login-password">
									비밀번호
								</label>

								<div className="login-input-wrapper">
									<i className="fas fa-lock"></i>

									<input
										id="login-password"
										type="password"
										value={pwd}
										onChange={changePwd}
										placeholder="비밀번호를 입력해주세요"
										autoComplete="current-password"
									/>
								</div>
							</div>

							<button
								type="button"
								className="login-submit-button"
								onClick={login}
							>
								<span>로그인</span>
								<i className="fas fa-arrow-right"></i>
							</button>
						</div>

						<div className="login-security-message">
							<i className="fas fa-shield-alt"></i>

							<span>
								안전한 로그인을 위해 계정 정보를 보호해주세요.
							</span>
						</div>
					</div>

					<p className="login-copyright">
						© 2026 OFFICEFLOW. All rights reserved.
					</p>
				</div>
			</section>
		</main>
	);
}

export default Login;