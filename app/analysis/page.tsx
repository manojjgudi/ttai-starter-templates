"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";

export default function AnalysisPage() {
  const { user, isLoaded } = useUser();
  const [sessionData, setSessionData] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  // Build iframe URL dynamically with user information
  const getIframeUrl = () => {
    if (!isLoaded || !user) return "https://app.toughtongueai.com/embed/676a4278ae833c968b618f19?bg=black&promptUserInfo=true";
    
    const userName = user.fullName || user.username || '';
    const userEmail = user.primaryEmailAddress?.emailAddress || '';
    
    return `https://app.toughtongueai.com/embed/676a4278ae833c968b618f19?bg=black&userName=${encodeURIComponent(userName)}&userEmail=${encodeURIComponent(userEmail)}`;
  };

  // Listen for iframe events
  useEffect(() => {
    const handleIframeEvents = (event: MessageEvent) => {
      // Optional origin verification for security
      // if (event.origin !== 'https://app.toughtongueai.com') return;

      const data = event.data;
      
      if (data && data.event) {
        console.log('Received event:', data);
        
        switch (data.event) {
          case 'onStart':
            console.log('Session started:', data);
            break;
            
          case 'onStop':
            console.log('Session stopped:', data);
            setSessionId(data.sessionId);
            setSessionData(data);
            break;
        }
      }
    };

    window.addEventListener('message', handleIframeEvents);
    
    // Cleanup
    return () => {
      window.removeEventListener('message', handleIframeEvents);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Language Analysis</h1>
      
      {/* ToughTongueAI Iframe */}
      <div className="mb-8">
        <iframe
          src={getIframeUrl()}
          width="100%"
          height="700px"
          frameBorder="0"
          allow="microphone; camera; display-capture"
        ></iframe>
      </div>
      
      {/* Session Data Display */}
      {sessionData && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Session Information</h2>
          <div className="bg-white p-4 rounded border">
            <p><strong>Session ID:</strong> {sessionId}</p>
            <p className="mt-4"><strong>Full Session Data:</strong></p>
            <pre className="bg-gray-100 p-3 rounded overflow-auto mt-2">
              {JSON.stringify(sessionData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
} 