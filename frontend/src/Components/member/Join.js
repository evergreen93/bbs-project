/* 회원가입 컴포넌트 */

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

import "../../css/join.css";


function Join() {

	const [id, setId] = useState("");
	const [name, setName] = useState("");
	const [pwd, setPwd] = useState("");
	const [checkPwd, setCheckPwd] = useState("");
	const [email, setEmail] = useState("");

	const navigate = useNavigate();

	const changeId = (event) => {
		setId(event.target.value);
	}

	const changeName = (event) => {
		setName(event.target.value);
	}

	const changePwd = (event) => {
		setPwd(event.target.value);
	}

	const changeCheckPwd = (event) => {
		setCheckPwd(event.target.value);
	}

	const changeEmail = (event) => {
		setEmail(event.target.value);
	}

	/* 아이디 중복 체크 */
	const checkIdDuplicate = async () => {

		await axios.get("/api/user", { params: { id: id } })
			.then((resp) => {
				console.log("[Join.js] checkIdDuplicate() success :D");
				console.log(resp.data);

				if (resp.status == 200) {
					alert("사용 가능한 아이디입니다.");
				}

			})
			.catch((err) => {
				console.log("[Join.js] checkIdDuplicate() error :<");
				console.log(err);

				const resp = err.response;
				if (resp.status == 400) {
					alert(resp.data);
				}
			});

	}

	/* 회원가입 */
	const join = async () => {

		const req = {
			id: id,
			name: name,
			pwd: pwd,
			checkPwd: checkPwd,
			email: email
		}

		await axios.post("/api/user/join", req)
			.then((resp) => {
				console.log("[Join.js] join() success :D");
				console.log(resp.data);

				alert(resp.data.id + "님 회원가입을 축하드립니다 🎊");
				navigate("/login");

			}).catch((err) => {
				console.log("[Join.js] join() error :<");
				console.log(err);

				// alert(err.response.data);

				const resp = err.response;
				if (resp.status == 400) {
					alert(resp.data);
				}
			});
	}


	return (
		<main className="join-page">
			<div className="join-background join-background-one"></div>
			<div className="join-background join-background-two"></div>

			<section className="join-container">
				<div className="join-intro">
					<div className="join-brand">
						<div className="join-brand-logo">
							<i className="fas fa-building"></i>
						</div>

						<div className="join-brand-text">
							<strong>OfficeFlow</strong>
							<span>SMART WORKSPACE</span>
						</div>
					</div>

					<div className="join-intro-content">
						<span className="join-intro-badge">
							GET STARTED
						</span>

						<h1>
							새로운 업무 공간을
							<br />
							시작해보세요
						</h1>

						<p>
							하나의 계정으로 근태 관리, 휴가 신청,
							<br />
							사내 게시판을 편리하게 이용할 수 있습니다.
						</p>
					</div>

					<div className="join-benefit-list">
						<div className="join-benefit-item">
							<span className="join-benefit-icon">
								<i className="fas fa-check"></i>
							</span>

							<div>
								<strong>간편한 계정 생성</strong>
								<p>기본 정보 입력만으로 가입할 수 있습니다.</p>
							</div>
						</div>

						<div className="join-benefit-item">
							<span className="join-benefit-icon">
								<i className="fas fa-check"></i>
							</span>

							<div>
								<strong>통합 업무 관리</strong>
								<p>사내 업무 기능을 하나의 공간에서 이용합니다.</p>
							</div>
						</div>

						<div className="join-benefit-item">
							<span className="join-benefit-icon">
								<i className="fas fa-check"></i>
							</span>

							<div>
								<strong>안전한 계정 관리</strong>
								<p>개인 계정으로 안전하게 서비스를 이용합니다.</p>
							</div>
						</div>
					</div>
				</div>

				<div className="join-form-area">
					<div className="join-form-card">
						<div className="join-form-header">
							<span className="join-form-eyebrow">
								CREATE ACCOUNT
							</span>

							<h2>회원가입</h2>

							<p>
								OfficeFlow를 이용하기 위한 정보를 입력해주세요.
							</p>
						</div>

						<div className="join-form">
							<div className="join-input-group">
								<label htmlFor="join-id">
									아이디
								</label>

								<div className="join-id-row">
									<div className="join-input-wrapper">
										<i className="far fa-user"></i>

										<input
											id="join-id"
											type="text"
											value={id}
											onChange={changeId}
											placeholder="사용할 아이디를 입력해주세요"
											autoComplete="username"
										/>
									</div>

									<button
										type="button"
										className="join-duplicate-button"
										onClick={checkIdDuplicate}
									>
										<i className="fas fa-check"></i>
										<span>중복 확인</span>
									</button>
								</div>
							</div>

							<div className="join-input-group">
								<label htmlFor="join-name">
									이름
								</label>

								<div className="join-input-wrapper">
									<i className="far fa-id-card"></i>

									<input
										id="join-name"
										type="text"
										value={name}
										onChange={changeName}
										placeholder="이름을 입력해주세요"
										autoComplete="name"
									/>
								</div>
							</div>

							<div className="join-input-group">
								<label htmlFor="join-password">
									비밀번호
								</label>

								<div className="join-input-wrapper">
									<i className="fas fa-lock"></i>

									<input
										id="join-password"
										type="password"
										value={pwd}
										onChange={changePwd}
										placeholder="비밀번호를 입력해주세요"
										autoComplete="new-password"
									/>
								</div>
							</div>

							<div className="join-input-group">
								<label htmlFor="join-check-password">
									비밀번호 확인
								</label>

								<div className="join-input-wrapper">
									<i className="fas fa-shield-alt"></i>

									<input
										id="join-check-password"
										type="password"
										value={checkPwd}
										onChange={changeCheckPwd}
										placeholder="비밀번호를 다시 입력해주세요"
										autoComplete="new-password"
									/>
								</div>
							</div>

							<div className="join-input-group">
								<label htmlFor="join-email">
									이메일
								</label>

								<div className="join-input-wrapper">
									<i className="far fa-envelope"></i>

									<input
										id="join-email"
										type="text"
										value={email}
										onChange={changeEmail}
										placeholder="이메일 주소를 입력해주세요"
										autoComplete="email"
									/>
								</div>
							</div>

							<button
								type="button"
								className="join-submit-button"
								onClick={join}
							>
								<span>
									<i className="fas fa-user-plus"></i>
									회원가입
								</span>

								<i className="fas fa-arrow-right"></i>
							</button>
						</div>

						<div className="join-login-guide">
							<span>이미 계정이 있으신가요?</span>

							<button
								type="button"
								onClick={() => navigate("/login")}
							>
								로그인하기
							</button>
						</div>
					</div>

					<p className="join-copyright">
						© 2026 OFFICEFLOW. All rights reserved.
					</p>
				</div>
			</section>
		</main>
	);
}

export default Join;