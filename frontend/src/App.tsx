import { useState } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import globalStyles from './App.module.css';

import Landing from './components/Landing';
import Editor from './components/Editor';
import Navbar from './components/Navbar';

function App() {

  const [navbarTitle, setNavbarTitle] = useState("Podplistic");

  const updateNavbarTitle = (data: string) => {
    setNavbarTitle(data);
  }

  return (
    <div className={globalStyles.App}>
      <Router>
        <Navbar title={navbarTitle}></Navbar>
        <div className={globalStyles.mainContent}>
          <Routes>
            <Route path="/" element={<Landing func={updateNavbarTitle} />} />
            <Route path="editor/:project" element={<Editor func={updateNavbarTitle} />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
