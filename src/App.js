// import { BrowserRouter, Routes, Route, } from "react-router-dom";

// import Signup from "./pages/Signup/Signup"
// import Login from "./pages/Login/Login"
// import Loader from "./components/UI/Loader";
// import Dashboard from "./pages/Dashboard/Dashboard";
// import Main from "./components/DashboardComponents/Main/Main";
// import UserManagment from "./components/DashboardComponents/User Managment/UserManagment"
// import Machines from "./components/DashboardComponents/Machines/Machines"
// import Operators from "./components/DashboardComponents/Operators/Operators"
// import Maintenance from "./components/DashboardComponents/Maintenance/Maintenance"
// import Companies from "./components/DashboardComponents/Companies/Companies";
// import JobSites from "./components/DashboardComponents/JobSites/JobSites";

// function App() {

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="*" element={<Loader />} />
//         <Route path="/dashboard" element={<Dashboard />}>
//           <Route index element={<Main />} />
//           <Route path="user-management" element={<UserManagment />} />
//           <Route path="job-sites" element={<JobSites />} />
//           <Route path="companies" element={<Companies />} />
//           <Route path="machines" element={<Machines />} />
//           <Route path="operators" element={<Operators />} />
//           <Route path="maintenance" element={<Maintenance />} />

//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "./components/UI/Loader";
import AddUser from "./components/DashboardComponents/User Managment/AddUser";

import { UserProvider } from "./Context/UserContext";
import AddMAchine from "./components/DashboardComponents/Machines/AddMachine";
import AddMachine from "./components/DashboardComponents/Machines/AddMachine";
import AddJobSites from "./components/DashboardComponents/JobSites/AddJobSites";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EmployeeMain from "./components/DashboardComponents/Main/EmployeeMain";
import AddMaintenance from "./components/DashboardComponents/Maintenance/AddMaintenance";
import SuperAdminSignup from "./components/RegistrationComponents/Signup/SuperAdminSignup";

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
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/super-admin-signup" element={<SuperAdminSignup />} />
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
              <Route path="machines/add-machine" element={<AddMachine />} />
              <Route path="job-sites/add-jobsites" element={<AddJobSites />} />
              <Route
                path="maintenance/add-maintenance"
                element={<AddMaintenance />}
              />
            </Route>

            {/* Dashboard Routes */}
            <Route path="/admin-dashboard" element={<Dashboard />}>
              <Route index element={<AdminMain />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="job-sites" element={<JobSites />} />
              {/* <Route path="companies" element={<Companies />} /> */}
              <Route path="machines" element={<Machines />} />
              <Route path="operators" element={<Operators />} />
              <Route path="maintenance" element={<Maintenance />} />
              <Route path="user-management/add-user" element={<AddUser />} />
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
