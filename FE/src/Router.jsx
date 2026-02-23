import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import OrgDashboard from "./pages/OrgDashboard";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import EmployeePage from "./pages/EmployeePage";
import WelcomeScreen from "./pages/WelcomeScreen";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeScreen />}></Route>
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
