import React from 'react';
import "./App.css";
import { Routes,
   Route,
   Navigate
   } from 'react-router-dom';
import GameMain from './pages/gameMain';

const App: React.FC = () => {
  return (
      <Routes>
        <Route path="/game/*" element={<GameMain/>}/>
        <Route path="*" element={<Navigate to="/game"/>}/>
        
        
        {/* 404 page */} 
        {/* <Route path="*" element={<NotFoundPage />} />  */}
      </Routes>
  );
};

export default App;