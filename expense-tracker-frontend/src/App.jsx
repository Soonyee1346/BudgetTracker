import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import DashboardPage from './components/DashboardPage';
import BudgetsPage from './pages/BudgetsPage';

function App() {
  return (
    <Router>
      <nav
        style={{
          display: 'flex',
          gap: '24px',
          padding: '16px 24px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e5e5'
        }}
      >
        <NavLink
          to="/"
          end
          style={({ isActive }) => ({
            textDecoration: 'none',
            fontWeight: 600,
            color: isActive ? '#1976d2' : '#333',
            borderBottom: isActive ? '2px solid #1976d2' : 'none',
            paddingBottom: '4px'
          })}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/budgets"
          style={({ isActive }) => ({
            textDecoration: 'none',
            fontWeight: 600,
            color: isActive ? '#1976d2' : '#333',
            borderBottom: isActive ? '2px solid #1976d2' : 'none',
            paddingBottom: '4px'
          })}
        >
          Budgets
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
