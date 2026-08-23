import React, { useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import ReportComplaint from './pages/ReportComplaint';
import ComplaintResult from './pages/ComplaintResult';
import ComplaintTracking from './pages/ComplaintTracking';
import OfficerDashboard from './pages/OfficerDashboard';
import ResolutionProof from './pages/ResolutionProof';
import VerificationResult from './pages/VerificationResult';
import AIStepLoader from './components/AIStepLoader';

import { demoComplaint } from './demo/demoData';
import { createComplaint, uploadResolutionProof } from './services/api';

export default function App() {
  const [role, setRole] = useState('citizen'); // 'citizen' | 'officer'
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home'|'report'|'analysis_loading'|'result'|'tracking'|'proof'|'verify_loading'|'verified'
  const [currentComplaint, setCurrentComplaint] = useState(demoComplaint);
  const [dataRefreshTrigger, setDataRefreshTrigger] = useState(0);

  // Trigger preset demo flow for hackathon judges
  const handleTriggerDemo = () => {
    setCurrentComplaint(demoComplaint);
    setRole('citizen');
    setCurrentScreen('result');
  };

  // Submit Complaint Flow
  const handleCreateComplaint = async (formData) => {
    setCurrentScreen('analysis_loading');
    const created = await createComplaint(formData);
    setCurrentComplaint(created);
  };

  // Submit Resolution Evidence Flow
  const handleSubmitEvidence = async (complaintId, evidenceData) => {
    setCurrentScreen('verify_loading');
    const verified = await uploadResolutionProof(complaintId, evidenceData);
    setCurrentComplaint(verified);
    setDataRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-neutral-050 text-neutral-900 font-body flex flex-col selection:bg-primary-500 selection:text-white">
      
      {/* Global Header Chrome */}
      <Header
        role={role}
        setRole={(newRole) => {
          setRole(newRole);
          if (newRole === 'officer') {
            setCurrentScreen('home'); // resets officer view state
          } else {
            setCurrentScreen('home');
          }
        }}
        onTriggerDemo={handleTriggerDemo}
      />

      {/* Main Screen Body View */}
      <div className="flex-1">
        
        {/* OFFICER ROLE VIEWS */}
        {role === 'officer' ? (
          currentScreen === 'proof' ? (
            <ResolutionProof
              complaint={currentComplaint}
              onBack={() => setCurrentScreen('home')}
              onSubmitEvidence={handleSubmitEvidence}
            />
          ) : currentScreen === 'verify_loading' ? (
            <AIStepLoader
              title="AI Verifying Resolution Evidence & Proof of Work..."
              steps={[
                'Photo received & metadata extracted',
                'Checking geo-coordinates alignment',
                'Comparing before/after issue scene condition',
                'Validating repair completion score',
                'Updating ticket status to VERIFIED'
              ]}
              onComplete={() => setCurrentScreen('verified')}
            />
          ) : currentScreen === 'verified' ? (
            <VerificationResult
              complaint={currentComplaint}
              onHome={() => setCurrentScreen('home')}
              onTrack={() => {
                setRole('citizen');
                setCurrentScreen('tracking');
              }}
              onReupload={() => setCurrentScreen('proof')}
            />
          ) : (
            <OfficerDashboard
              onRefreshData={dataRefreshTrigger}
              activeComplaint={currentComplaint}
              onSelectComplaint={(c) => setCurrentComplaint(c)}
              onNavigateProof={(c) => {
                setCurrentComplaint(c);
                setCurrentScreen('proof');
              }}
            />
          )
        ) : (
          /* CITIZEN ROLE VIEWS */
          <>
            {currentScreen === 'home' && (
              <Home
                onNavigate={(screen) => setCurrentScreen(screen)}
              />
            )}

            {currentScreen === 'report' && (
              <ReportComplaint
                onBack={() => setCurrentScreen('home')}
                onSubmitComplaint={handleCreateComplaint}
              />
            )}

            {currentScreen === 'analysis_loading' && (
              <AIStepLoader
                title="Analyzing your complaint with Vision & Decision AI..."
                steps={[
                  'Image received & preprocessed',
                  'Identifying issue classification (Pothole)',
                  'Determining responsible department',
                  'Calculating priority urgency score (86/100)',
                  'Generating complaint tracking ticket (CT-1001)'
                ]}
                onComplete={() => setCurrentScreen('result')}
              />
            )}

            {currentScreen === 'result' && (
              <ComplaintResult
                complaint={currentComplaint}
                onTrack={() => setCurrentScreen('tracking')}
              />
            )}

            {currentScreen === 'tracking' && (
              <ComplaintTracking
                complaint={currentComplaint}
                onBack={() => setCurrentScreen('home')}
                onNavigateOfficer={(c) => {
                  setCurrentComplaint(c);
                  setRole('officer');
                }}
              />
            )}

            {currentScreen === 'verify_loading' && (
              <AIStepLoader
                title="AI Verifying Resolution Evidence..."
                steps={[
                  'Photo received & metadata extracted',
                  'Checking geo-coordinates alignment',
                  'Comparing before/after issue scene condition',
                  'Validating repair completion score',
                  'Updating ticket status to VERIFIED'
                ]}
                onComplete={() => setCurrentScreen('verified')}
              />
            )}

            {currentScreen === 'verified' && (
              <VerificationResult
                complaint={currentComplaint}
                onHome={() => setCurrentScreen('home')}
                onTrack={() => setCurrentScreen('tracking')}
                onReupload={() => setCurrentScreen('proof')}
              />
            )}
          </>
        )}

      </div>
    </div>
  );
}
