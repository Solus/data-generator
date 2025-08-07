'use client';

import Head from 'next/head';
import React, { useState } from 'react';
// We'll create these components in the next steps
// import IbanGenerator from '../components/IbanGenerator';
// import OibGenerator from '../components/OibGenerator';
// import NamesGenerator from '../components/NamesGenerator';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'iban' | 'oib' | 'names'>('iban');

  // We'll use this placeholder for now until we create the components
  const PlaceholderComponent = ({ title }: { title: string }) => (
    <div className="p-5 text-center text-gray-500">
      <h2 className="mb-3 text-2xl font-semibold">{title}</h2>
      <p>Content for this tab will be added here in the next steps.</p>
    </div>
  );

  return (
    <>
      <Head>
        <title>Croatian IBAN, OIB, and Name Generator</title>
      </Head>
      <div className="mx-auto my-10 max-w-4xl p-4">
        <h1 className="mb-6 text-3xl font-bold">Croatian IBAN, OIB, and Name Generator</h1>

        <ul className="mb-6 flex space-x-2 border-b border-gray-200" role="tablist">
          <li className="flex-1 text-center" role="presentation">
            <button
              className={`inline-block w-full rounded-t-lg p-3 text-lg font-medium transition-colors duration-200 ease-in-out hover:bg-gray-100 ${
                activeTab === 'iban' ? 'border-b-2 border-blue-600 bg-white text-blue-600' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('iban')}
              type="button"
            >
              <i className="fas fa-money-check-dollar mr-2"></i> IBAN Generator
            </button>
          </li>
          <li className="flex-1 text-center" role="presentation">
            <button
              className={`inline-block w-full rounded-t-lg p-3 text-lg font-medium transition-colors duration-200 ease-in-out hover:bg-gray-100 ${
                activeTab === 'oib' ? 'border-b-2 border-blue-600 bg-white text-blue-600' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('oib')}
              type="button"
            >
              <i className="fas fa-id-card mr-2"></i> OIB Generator
            </button>
          </li>
          <li className="flex-1 text-center" role="presentation">
            <button
              className={`inline-block w-full rounded-t-lg p-3 text-lg font-medium transition-colors duration-200 ease-in-out hover:bg-gray-100 ${
                activeTab === 'names' ? 'border-b-2 border-blue-600 bg-white text-blue-600' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('names')}
              type="button"
            >
              <i className="fas fa-users mr-2"></i> Names
            </button>
          </li>
        </ul>

        <div className="rounded-b-lg border-x border-b border-gray-200 p-4 shadow-sm">
          {activeTab === 'iban' && (
            <div className="tab-pane fade show active">
              <PlaceholderComponent title="IBAN Generator" />
            </div>
          )}
          {activeTab === 'oib' && (
            <div className="tab-pane fade show active">
              <PlaceholderComponent title="OIB Generator" />
            </div>
          )}
          {activeTab === 'names' && (
            <div className="tab-pane fade show active">
              <PlaceholderComponent title="Names Generator" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
