import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../admin/AdminDashboard";
import Home from "../app/Home"
import BbsList from "../bbs/BbsList"
import BbsWrite from "../bbs/BbsWrite"
import BbsDetail from "../bbs/BbsDetail"
import BbsUpdate from "../bbs/BbsUpdate"
import BbsAnswer from "../bbs/BbsAnswer"
import Join from "../member/Join"
import Login from "../member/Login"
import Logout from "../member/Logout"
import Dashboard from "../work/Dashboard";
import Attendance from "../work/Attendance";
import Vacation from "../work/Vacation";
import AdminVacationPage from "../admin/AdminVacationPage";
import AdminMemberPage from "../admin/AdminMemberPage";
import AdminBoardPage from "../admin/AdminBoardPage";
import AdminAttendancePage from "../admin/AdminAttendancePage";


function Router() {

	return (
			<Routes>
				<Route path="/admin/attendance" element={<AdminAttendancePage />}/>
				<Route path="/" element={<Login />} />
				<Route path="/admin/members" element={<AdminMemberPage />} />
				<Route path="/admin/boards" element={<AdminBoardPage />} />
				<Route path="/admin/vacations" element={<AdminVacationPage />}/>
				<Route path="/bbslist" element={<BbsList />}></Route>
				<Route path="/bbswrite" element={<BbsWrite />}></Route>
				<Route path="/bbsdetail/:seq" element={<BbsDetail />}></Route>
				<Route path="/bbsupdate" element={<BbsUpdate />}></Route>
				<Route path="/bbsanswer/:parentSeq" element={<BbsAnswer />}></Route>
				<Route path="/admin" element={<AdminDashboard />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/attendance" element={<Attendance />} />
				<Route path="/vacation" element={<Vacation />} />

				<Route path="/login" element={<Login />}></Route>
				<Route path="/join" element={<Join />}></Route>
				<Route path="/logout" element={<Logout />}></Route>
			</Routes>
	);
}

export default Router;