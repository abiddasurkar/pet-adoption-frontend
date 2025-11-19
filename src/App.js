import { useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./layout/Layout";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Loans from "./pages/Loans";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const user = {
    name: "Abid Dasurkar",
    role: "Premium Client",
    initials: "AD",
  };

  const renderPage = () => {
    const pages = {
      dashboard: <Dashboard />,
      transactions: <Transactions />,
      loans: <Loans />,
      profile: <Profile />,
      settings: <Settings />,
    };
    return pages[currentPage] || pages.dashboard;
  };

  return (
    <ThemeProvider>
      <Layout
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
      >
        {renderPage()}
      </Layout>
    </ThemeProvider>
  );
}