import { Routes, Route } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import Home from './pages/Home'
import DoctorDashboard from './pages/DoctorDashboard'

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
        </Routes>
      </div>
    </ToastProvider>
  )
}

export default App
