import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Education from './components/Education';
import Projects from './components/Projects';
import Photography from './components/Photography';
import Contact from './components/Contact';
import AIChat from './components/AIChat';
import Press from './components/Press';
import { ChatProvider } from './contexts/ChatContext';

function App() {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
        <Header />
        <main className="relative z-10">
          <Hero />
          <Experience />
          <Education />
          <Projects />
          <Photography />
          <Press />
          <Skills />
          <Contact />
        </main>
        <AIChat />
      </div>
    </ChatProvider>
  );
}

export default App;
