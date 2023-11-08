import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';

import Landing from './components/Landing';
import Editor from './components/Editor';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar title={"Podplistic"}></Navbar>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="editor" element={<Editor />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
