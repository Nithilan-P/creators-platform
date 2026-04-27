import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - renders Register page at / */}
        <Route path="/" element={<Register />} />
        
        {/* Register Page */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;