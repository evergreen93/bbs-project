/* 로그인 컴포넌트 */

import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";


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
		<div>
			<table className="table">
				<tbody>
				<tr>
					<th className="col-3">아이디</th>
					<td>
						<input
							type="text"
							value={id}
							onChange={changeId}
							size="50px"
						/>
					</td>
				</tr>

				<tr>
					<th>비밀번호</th>
					<td>
						<input
							type="password"
							value={pwd}
							onChange={changePwd}
							size="50px"
						/>
					</td>
				</tr>
				</tbody>
			</table>

			<br />

			<div className="my-1 d-flex justify-content-center">
				<button
					className="btn btn-outline-secondary"
					onClick={login}
				>
					<i className="fas fa-sign-in-alt"></i>
					{" "}로그인
				</button>
			</div>
		</div>
	);
}

export default Login;