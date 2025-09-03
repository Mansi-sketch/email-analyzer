import React, { useEffect, useState } from 'react';

type Email = {
  _id?: string;
  subject?: string;
  from?: string;
  esp?: string;
  receivingChain?: string[];
  createdAt?: string;
};

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

export default function App(): JSX.Element {
  const [emails, setEmails] = useState<Email[]>([]);

  async function load(): Promise<void> {
    try {
      const res = await fetch(`${API}/emails`);
      const data = await res.json();
      setEmails(data || []);
    } catch (err) {
      console.error('Failed to fetch emails', err);
      setEmails([]);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">📧 Email Analyzer</h1>
      {emails.length > 0 ? (
        emails.map((email, index) => (
          <div key={index} className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <p><strong>Subject:</strong> {email.subject}</p>
              <p><strong>From:</strong> {email.from}</p>
              <p>
                <strong>ESP:</strong>{' '}
                <span className="px-2 py-1 rounded bg-green-100">{email.esp}</span>
              </p>
            </div>
            <div className="mt-4">
              <h2 className="font-semibold">Receiving Chain</h2>
              <ul className="list-disc list-inside text-sm">
                {email.receivingChain?.map((step, i) => (
                  <li key={i} className="break-words">{step}</li>
                ))}
              </ul>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No emails yet. Seed some or send a test email.</p>
      )}
    </div>
  );
}
