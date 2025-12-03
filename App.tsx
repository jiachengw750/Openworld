
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ProjectDetails } from './pages/ProjectDetails';
import { MyDonations } from './pages/MyDonations';
import { MyProjects } from './pages/MyProjects';
import { ProjectManagement } from './pages/ProjectManagement';
import { MyWallet } from './pages/MyWallet';
import { Settings } from './pages/Settings';
import { QuestPage } from './pages/Quest';
import { QuestDetailsPage } from './pages/QuestDetails';
import { Workspace } from './pages/Workspace';
import { Profile } from './pages/Profile';
import { CreateQuest } from './pages/CreateQuest';
import { QuestSelection } from './pages/QuestSelection';
import { QuestConsole } from './pages/QuestConsole';
import { WalletProvider } from './context/WalletContext';
import { ToastProvider } from './context/ToastContext';

const App: React.FC = () => {
  return (
    <WalletProvider>
      <ToastProvider>
        <HashRouter>
          <div className="min-h-screen flex flex-col font-sans text-ink bg-paper antialiased selection:bg-accent selection:text-white">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/project/:id" element={<ProjectDetails />} />
                <Route path="/quest" element={<QuestPage />} />
                <Route path="/quest/:id" element={<QuestDetailsPage />} />
                <Route path="/create-quest" element={<CreateQuest />} />
                <Route path="/my-donations" element={<MyDonations />} />
                <Route path="/my-projects" element={<MyProjects />} />
                <Route path="/my-projects/:id/manage" element={<ProjectManagement />} />
                <Route path="/my-wallet" element={<MyWallet />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/workspace" element={<Workspace />} />
                <Route path="/workspace/quest/:id/selection" element={<QuestSelection />} />
                <Route path="/workspace/quest/:id/console" element={<QuestConsole />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </HashRouter>
      </ToastProvider>
    </WalletProvider>
  );
};

export default App;
