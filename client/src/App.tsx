import React from 'react';
import "./App.css";
import { Routes,
   Route,
   Navigate
   } from 'react-router-dom';
import GameMain from './pages/gameMain';
import AdminMain from './pages/adminMain';

const App: React.FC = () => {
  return (
      <Routes>
        <Route path="/game/*" element={<GameMain/>}/>
        <Route path="/admin/*" element={<AdminMain/>}/>
        
        {/* Redirect to game main if no specific path is matched */}
        <Route path="*" element={<Navigate to="/game"/>}/>
        
        
        {/* 404 page */} 
        {/* <Route path="*" element={<NotFoundPage />} />  */}
      </Routes>
  );
};

export default App;