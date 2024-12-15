import DashBoard from "./components/DashBoard.jsx";
import NotificationsSignInPageError from "./components/NotificationsSignInPageError.jsx";
import CreditsPieChart from "./components/CreditsPieChart.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import DepartmentSelect from "./components/DepartmentSelect.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route
          path="/"
          element={
            <NotificationsSignInPageError setIsLoggedIn={setIsLoggedIn} />
          }
        />

        <Route
          path="/select-department"
          element={
            isLoggedIn ? <DepartmentSelect /> : <Navigate to="/" replace />
          }
        />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/chart" element={<CreditsPieChart />} />
      </Routes>
    </Router>
  );
}

export default App;
