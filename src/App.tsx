import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { WorkCreate } from './pages/WorkCreate';
import { WorkDetail } from './pages/WorkDetail';
import { Profile } from './pages/Profile';
import { Analytics } from './pages/Analytics';
import { Debug } from './pages/Debug';
import { AuthProvider } from './lib/auth-context';
import { isDevelopment, runDevChecks } from './lib/development';

// Run development checks
if (isDevelopment) {
  runDevChecks().catch(console.error);
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="works/new" element={<WorkCreate />} />
            <Route path="works/:id" element={<WorkDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="analytics" element={<Analytics />} />
            {isDevelopment && <Route path="debug" element={<Debug />} />}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;