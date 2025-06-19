import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import RoadmapPDF from './RoadmapPDF'; // You’ll create this component

import { useState } from 'react';
const printRef = useRef();

import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [resumeSkills, setResumeSkills] = useState([]);
  const [jobDesc, setJobDesc] = useState("");
  const [matchResult, setMatchResult] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleResumeUpload = async () => {
    const formData = new FormData();
    formData.append("resume", file);
    const res = await axios.post("http://localhost:5000/upload-resume", formData);
    setResumeSkills(res.data.skills || []);
  };

  const handleSkillMatch = async () => {
    const res = await axios.post("http://localhost:5000/match-skills", {
      resumeSkills,
      jobDesc,
    });
    setMatchResult(res.data);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">📄 SkillSync</h1>

      {/* Resume Upload */}
      <input type="file" onChange={handleFileChange} accept=".pdf" className="mb-4" />
      <button onClick={handleResumeUpload} className="bg-blue-500 text-white px-4 py-2 rounded mb-6">Upload Resume</button>

      {/* Job Description Input */}
      <textarea
        className="w-full p-2 border rounded mb-4"
        rows={6}
        placeholder="Paste job description here..."
        onChange={(e) => setJobDesc(e.target.value)}
      ></textarea>
      <button onClick={handleSkillMatch} className="bg-green-600 text-white px-4 py-2 rounded mb-4">Match Skills</button>

      {/* Result Display */}
      {matchResult && (
        
  <>
    <ReactToPrint
      trigger={() => (
        <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          📥 Download PDF
        </button>
      )}
      content={() => printRef.current}
      documentTitle="SkillSync_Roadmap"
    />

    {/* Hidden printable component */}
    <div className="hidden">
      <RoadmapPDF ref={printRef} data={matchResult} />
    </div>
  </>


        <div className="bg-gray-100 p-4 rounded shadow mt-6">
          <h2 className="text-xl font-semibold text-purple-700">🔍 Match Result</h2>
          <p>✅ Match %: <b>{matchResult.matchPercent}%</b></p>
          <p className="mt-2">✅ Matched: {matchResult.matched.join(", ")}</p>
          <p className="mt-2 text-red-600">❌ Missing: {matchResult.missing.join(", ")}</p>
          <h3 className="mt-4 text-green-700 font-semibold">📚 Suggested Roadmap:</h3>
          <ul className="list-disc ml-5">
            {matchResult.roadmap.map((item, idx) => (
              <li key={idx}><b>Week {item.week}</b>: Learn {item.skill} → <a href={item.link} target="_blank" rel="noreferrer" className="text-blue-600 underline">Resource</a></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
