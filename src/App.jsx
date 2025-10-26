import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import AppLayout from './components/AppLayout.jsx'
import HomePage from './pages/Home.jsx'
import CheckInPage from './pages/CheckInPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import JournalPage from './pages/JournalPage.jsx'
import ForumPage from './pages/ForumPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import './App.css'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3
}

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Routes location={location}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/check-in"
              element={(
                <ProtectedRoute>
                  <CheckInPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/dashboard"
              element={(
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/analytics"
              element={(
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/journal"
              element={(
                <ProtectedRoute>
                  <JournalPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/forum"
              element={(
                <ProtectedRoute>
                  <ForumPage />
                </ProtectedRoute>
              )}
            />
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return <AnimatedRoutes />
}
