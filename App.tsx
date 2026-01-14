import React from 'react';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import Skills from './components/Skills.tsx';
import Experience from './components/Experience.tsx';
import Education from './components/Education.tsx';
import Projects from './components/Projects.tsx';
import Photography from './components/Photography.tsx';
import Contact from './components/Contact.tsx';
import AIChat from './components/AIChat.tsx';
import Press from './components/Press.tsx';
import { ChatProvider } from './contexts/ChatContext.tsx';

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