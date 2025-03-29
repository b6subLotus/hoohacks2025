import React, { useState } from 'react';

function App() {
  const [choice1, setChoice1] = useState('');
  const [choice2, setChoice2] = useState('');
  const [timeImportance, setTimeImportance] = useState('');
  const [moneyImportance, setMoneyImportance] = useState(''); //adding money
  const [preferenceImportance, setPreferenceImportance] = useState(''); //adding preferences
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGetAdvice = async () => {
    if (!choice1 || !choice2 || !timeImportance || !moneyImportance || !preferenceImportance) {
      alert("Please fill in all fields."); //if not filled in give error
      return;
    }

    setLoading(true); //set loading after
    setAiResponse('');

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', { //stack OF
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Decision Helper Enhanced',
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [
            { //instructions to the gpt
              role: 'user',
              content: `You are helping someone make decision. Help the user choose between:
- Option A: ${choice1}
- Option B: ${choice2}

Consider these decision factors:
- Time: ${timeImportance}
- Money: ${moneyImportance}
- Personal Preference: ${preferenceImportance}

Provide:
- A quick pros and cons comparison
- A clear recommendation based on these priorities
`,
            },
          ],
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setAiResponse(data.choices[0].message.content);
      } else {
        setAiResponse("No response received. Try again.");
      }
    } catch (error) {
      console.error("API Error:", error);
      setAiResponse("Something went wrong. Check your API key or internet connection.");
    }

    setLoading(false);
  };

  return ( //this style can be toyed around with option A and Option B's box
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}> Decision Maker</h1>
      <div style={{ marginBottom: '1rem' }}>
        <label>Option A: </label>   
        <input value={choice1} onChange={(e) => setChoice1(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Option B: </label>
        <input value={choice2} onChange={(e) => setChoice2(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Time Importance: </label>
        <select value={timeImportance} onChange={(e) => setTimeImportance(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
          <option value="">Select</option>
          <option>Not important</option>
          <option>Somewhat important</option>
          <option>Very important</option>
        </select>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Money Importance: </label>
        <select value={moneyImportance} onChange={(e) => setMoneyImportance(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
          <option value="">Select</option>
          <option>Not important</option>
          <option>Somewhat important</option>
          <option>Very important</option>
        </select>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Personal Preference: </label>
        <select value={preferenceImportance} onChange={(e) => setPreferenceImportance(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
          <option value="">Select</option>
          <option value="Neither">Neither</option>
          <option value="Option A">Option A</option>
          <option value="Option B">Option B</option>
        </select>
      </div>
      <button onClick={handleGetAdvice} disabled={loading} style={{ padding: '0.75rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px' }}>
        {loading ? 'Thinking...' : 'Make your decision'}
      </button>

      {aiResponse && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '6px', whiteSpace: 'pre-wrap' }}>
          {aiResponse}
        </div>
      )}
    </div>
  );
}
//uptop is even more formatting for the AI response and the drop down
export default App;