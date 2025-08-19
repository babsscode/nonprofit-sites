import { Routes, Route } from 'react-router-dom'
import LogIn from './pages/LogIn'
import WebsiteBuilder from './pages/WebsiteBuilder'
import { ProtectedRoute } from './ProtectedRoute'
import Dashboard from './pages/Dashboard'
import NotFoundPage from './pages/NotFoundPage'
import PublicWebsiteView from './pages/PublicWebsiteView'
import Landing from './pages/Landing'

const MainRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
            <Landing/>
            } />
      <Route path="/login" element={<LogIn />} />
      
      {/* Public website display route */}
      <Route path="/:slug" element={<PublicWebsiteView />} />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/builder" 
        element={
          <ProtectedRoute>
            <WebsiteBuilder />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/builder/:websiteId" 
        element={
          <ProtectedRoute>
            <WebsiteBuilder />
          </ProtectedRoute>
        } 
      />
      
      {/* 404 - Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default MainRoutes