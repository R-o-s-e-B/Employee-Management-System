import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import OrgDashboard from "./pages/OrgDashboard";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import EmployeePage from "./pages/EmployeePage";

const Router = () => {
  return (
    <BrowserRouter>
      <nav>
        <Link className="m-10" to="/">
          Home
        </Link>
        <Link to="/login">Login/Signup Page</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/orgDashboard/:orgId" element={<OrgDashboard />} />
        <Route
          path="/deptDashboard/:deptId"
          element={<DepartmentDashboard />}
        />
        <Route path="/employee/:employeeId" element={<EmployeePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
