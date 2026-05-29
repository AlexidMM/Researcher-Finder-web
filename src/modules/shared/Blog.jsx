import { useState } from 'react';
import Navbar from './Navbar';
import '../student/student.scss';

export default function Blog() {



  return (
    <div className="dashboard-layout">
      <Navbar />
      
      <main className="dashboard-content">
        <header className="welcome-header">
          <h1>Pestaña de Blog </h1>
          <p>Descubre las publicaciones de los investigadores con los que podrías empezar a colaborar en un futuro cercano.</p>
        </header>


      </main>
    </div>
  );
}