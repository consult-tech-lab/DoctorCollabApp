import React, { useState, useEffect } from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
// Removed: import { Button } from '@/components/ui/button';
import { auth } from './firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { translateText } from './translate';
// New secure API call
const response = await fetch('/api/summarize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: fullText }),
});

const data = await response.json();
const summary = data.summary;

import pdfjsLib from 'pdfjs-dist';
export default function DoctorCollabApp() {
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [aiSummary, setAiSummary] = useState('');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({ name: currentUser.email, specialty: 'Cardiology', language, country: 'USA' });
      }
    });
  }, [language]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };


  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async function () {
        const typedArray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map(item => item.str).join(' ');
        }
        const response = await fetch('/api/summarize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: fullText }),
});
const data = await response.json();
const summary = data.summary;
        const translated = await translateText(summary, language);
        setDocuments([...documents, file]);
        setAiSummary(translated);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    const translated = await translateText(message, language);
    setChatMessages([...chatMessages, { sender: user.name, message: translated }]);
    e.target.reset();
  };

  const handleDownloadSummary = () => {
    const blob = new Blob([aiSummary], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'summary.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100">
        <h1 className="text-2xl font-bold mb-4">Doctor Collaboration Platform</h1>
        <input
          type="email"
          placeholder="Email"
          value={loginData.email}
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          className="mb-2 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={loginData.password}
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          className="mb-4 p-2 border rounded"
        />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mb-4 p-2 border rounded"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="pt">Portuguese</option>
          <option value="ar">Arabic</option>
          <option value="zh">Chinese</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="nl">Dutch</option>
        </select>
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Sign in & Verify
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-xl font-bold mb-4">Welcome, {user.name} ({user.specialty}, {user.country})</h1>
      <Tabs>
        <TabList className="flex space-x-4">
          <Tab>Discussions</Tab>
          <Tab>Upload Documents</Tab>
          <Tab>AI Summary</Tab>
        </TabList>

        <TabPanel>
          <form onSubmit={handleChatSubmit} className="mb-4">
            <input
              name="message"
              placeholder="Enter message"
              className="p-2 border rounded w-full mb-2"
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Send (Auto-Translated)
            </button>
          </form>
          <div className="bg-white p-4 shadow rounded">
            {chatMessages.map((msg, i) => (
              <div key={i} className="mb-2">
                <strong>{msg.sender}:</strong> {msg.message}
              </div>
            ))}
          </div>
        </TabPanel>

        <TabPanel>
          <input type="file" accept="application/pdf" onChange={handleUpload} className="mb-4" />
          <ul>
            {documents.map((doc, idx) => (
              <li key={idx} className="text-blue-700">{doc.name}</li>
            ))}
          </ul>
        </TabPanel>

        <TabPanel>
          <div className="bg-yellow-100 p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">AI-Powered Document Summary</h2>
            <p className="whitespace-pre-wrap">{aiSummary || 'Upload a PDF to see summary and translation.'}</p>
            {aiSummary && (
              <button
                onClick={handleDownloadSummary}
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Download Summary
              </button>
            )}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}
