import React, { useState } from 'react';

const WhatsAppOptIn = ({ reportId, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'submitting', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMessage('Please enter a valid phone number with country code (e.g., +1234567890)');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      // Assuming your backend is running on localhost:8000
      const response = await fetch('http://localhost:8000/schedule-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          report_id: reportId,
          phone_number: phoneNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule reminder');
      }

      setStatus('success');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      setStatus('error');
      setErrorMessage('Failed to schedule reminder. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-green-800 font-medium">✅ Reminders Scheduled!</h3>
        <p className="text-green-600 text-sm mt-1">
          You will receive WhatsApp notifications when it's time to take your medication.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-2">WhatsApp Dose Reminders</h3>
      <p className="text-sm text-gray-500 mb-4">
        Enter your phone number to receive a WhatsApp message when it's time for your medication.
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="tel"
          placeholder="+1234567890"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={status === 'submitting'}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 disabled:opacity-50 transition-colors"
        >
          {status === 'submitting' ? 'Scheduling...' : 'Opt-in'}
        </button>
      </form>
      
      {status === 'error' && (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default WhatsAppOptIn;
