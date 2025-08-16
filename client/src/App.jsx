import { Excalidraw } from "@excalidraw/excalidraw";

import "@excalidraw/excalidraw/index.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home'; import Dashboard from './pages/Dashboard'; 
const App = () => {
  return (
    <>
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </BrowserRouter>
    </>
  );
};

export default App;
