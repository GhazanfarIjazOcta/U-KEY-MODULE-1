import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "./components/UI/Loader";
import { UserProvider } from "./Context/UserContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EmployeeMain from "./components/DashboardComponents/Main/EmployeeMain";
import AddMaintenance from "./components/DashboardComponents/Maintenance/AddMaintenance";
import SuperAdminSignup from "./components/RegistrationComponents/Signup/SuperAdminSignup";

import AddOperator from "./components/DashboardComponents/Operators/AddOperator";
import AddMachine from "./components/DashboardComponents/Machines/AddMachine";
import AddJobSites from "./components/DashboardComponents/JobSites/AddJobSites";
import AddUser from "./components/DashboardComponents/User Managment/AddUser";
import ForemanSignup from "./components/RegistrationComponents/Signup/ForemanSignup";

// Lazy load the components
const Signup = lazy(() => import("./pages/Signup/Signup"));
const Login = lazy(() => import("./pages/Login/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Main = lazy(() => import("./components/DashboardComponents/Main/Main"));
const UserManagement = lazy(() =>
  import("./components/DashboardComponents/User Managment/UserManagment")
);
const Machines = lazy(() =>
  import("./components/DashboardComponents/Machines/Machines")
);
const Operators = lazy(() =>
  import("./components/DashboardComponents/Operators/Operators")
);
const Maintenance = lazy(() =>
  import("./components/DashboardComponents/Maintenance/Maintenance")
);
const Companies = lazy(() =>
  import("./components/DashboardComponents/Companies/Companies")
);
const JobSites = lazy(() =>
  import("./components/DashboardComponents/JobSites/JobSites")
);
const AdminMain = lazy(() =>
  import("./components/DashboardComponents/Main/AdminMain")
);

function App() {
  return (
    <BrowserRouter>
      {/* Suspense with Loader fallback */}
      <UserProvider>
        <Suspense fallback={<Loader />}>
          <Routes >
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/super-admin-signup" element={<SuperAdminSignup />} />
            <Route path="/foreman-signup" element={<ForemanSignup />} />
            {/* Use a wildcard for unknown routes */}
            <Route path="*" element={<Loader />} />
        

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Main />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="job-sites" element={<JobSites />} />
              <Route path="companies" element={<Companies />} />
              <Route path="machines" element={<Machines />} />
              <Route path="operators" element={<Operators />} />
              <Route path="maintenance" element={<Maintenance />} />
              <Route path="user-management/add-user" element={<AddUser />} />
              <Route path="operators/add-operator" element={<AddOperator />} />
              <Route path="machines/add-machine" element={<AddMachine />} />
              <Route path="job-sites/add-jobsites" element={<AddJobSites />} />
              <Route path="maintenance/add-maintenance" element={<AddMaintenance />}/>
            </Route>

            {/* Dashboard Routes */}
            <Route path="/admin-dashboard" element={<Dashboard />}>
              <Route index element={<AdminMain />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="job-sites" element={<JobSites />} />
              <Route path="machines" element={<Machines />} />
              <Route path="operators" element={<Operators />} />
              <Route path="maintenance" element={<Maintenance />} />
              <Route path="user-management/add-user" element={<AddUser />} />
              <Route path="operators/add-operator" element={<AddOperator />} />
              <Route path="machines/add-machine" element={<AddMachine />} />
              <Route path="job-sites/add-jobsites" element={<AddJobSites />} />
              <Route
                path="maintenance/add-maintenance"
                element={<AddMaintenance />}
              />
            </Route>

            {/* Dashboard Routes */}
            <Route path="/employee-dashboard" element={<Dashboard />}>
              <Route index element={<EmployeeMain />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="job-sites" element={<JobSites />} />
              <Route path="companies" element={<Companies />} />
              <Route path="machines" element={<Machines />} />
              <Route path="operators" element={<Operators />} />
              <Route path="maintenance" element={<Maintenance />} />
              <Route path="user-management/add-user" element={<AddUser />} />
              <Route path="operators/add-operator" element={<AddOperator />} />
              <Route path="machines/add-machine" element={<AddMachine />} />
              <Route
                path="maintenance/add-maintenance"
                element={<AddMaintenance />}
              />
            </Route>
          </Routes>
        </Suspense>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
