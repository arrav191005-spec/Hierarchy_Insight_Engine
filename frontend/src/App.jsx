import React from "react";
import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import Auth from './components/Auth'

function App() {
  const [input, setInput] = useState('{\n  "data": ["A->B", "A->C", "B->D"]\n}')
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      // Validate JSON input
      let parsedInput
      try {
        parsedInput = JSON.parse(input)
      } catch (e) {
        throw new Error('Invalid JSON format. Please check your input.')
      }

      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        throw new Error('Input must be a JSON object with a "data" array.')
      }

      const res = await axios.post(`${API_URL}/bfhl`, parsedInput, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setResponse(res.data)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return <Auth setToken={setToken} setUser={setUser} />
  }

  return (
    <div className="App">
      <div className="user-header">
        <div style={{ textAlign: 'left' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>Welcome back,</p>
          <p style={{ margin: 0, fontWeight: 700 }}>{user?.name}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <h1>Hierarchy Insight Engine</h1>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
        Paste your node relationships in JSON format to process hierarchies.
      </p>

      <div className="card">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"data": ["A->B", "A->C"]}'
          spellCheck="false"
        />

        {error && <div className="error">{error}</div>}

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Processing...' : 'Process Hierarchies'}
        </button>
      </div>

      {response && (
        <div className="output-container">
          <h2>Results</h2>

          <div className="summary-grid">
            <div className="summary-item">
              <h3>Total Trees</h3>
              <p>{response.summary.total_trees}</p>
            </div>
            <div className="summary-item">
              <h3>Total Cycles</h3>
              <p>{response.summary.total_cycles}</p>
            </div>
            <div className="summary-item">
              <h3>Largest Tree</h3>
              <p>{response.summary.largest_tree_root || 'N/A'}</p>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3>Hierarchies</h3>
            <pre>{JSON.stringify(response.hierarchies, null, 2)}</pre>
          </div>

          {response.invalid_entries.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h3 style={{ color: '#f87171' }}>Invalid Entries</h3>
              <pre style={{ borderColor: '#f87171' }}>
                {JSON.stringify(response.invalid_entries, null, 2)}
              </pre>
            </div>
          )}

          {response.duplicate_edges.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h3 style={{ color: '#fbbf24' }}>Duplicate Edges</h3>
              <pre style={{ borderColor: '#fbbf24' }}>
                {JSON.stringify(response.duplicate_edges, null, 2)}
              </pre>
            </div>
          )}

          <div style={{ marginTop: '2rem' }}>
            <h3>Full API Response</h3>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
