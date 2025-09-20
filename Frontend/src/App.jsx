import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './Pages/HomePage'
import SignUpPage from './Pages/SignUpPage';
import SignInPage from './Pages/SignInPage';
import SuccessPage from './Pages/SuccessPage';
import ProtectedRoute from './Pages/ProtectedRoute';

function App() {

  return (
     <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <SuccessPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
