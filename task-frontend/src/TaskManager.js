// src/TaskManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/tasks';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newTaskId, setNewTaskId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (err) {
      setError('Failed to load tasks. Is the Laravel server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!inputValue.trim()) {
      setError('Task title cannot be empty.');
      return;
    }
    setError('');
    setAdding(true);
    try {
      const response = await axios.post(API_URL, { title: inputValue.trim() });
      setTasks(prev => [...prev, response.data]);
      setNewTaskId(response.data.id);
      setInputValue('');
      setTimeout(() => setNewTaskId(null), 1000);
    } catch (err) {
      setError('Failed to add task. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddTask();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Share+Tech+Mono&family=Exo+2:wght@300;400;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #050a0f;
          min-height: 100vh;
        }

        .tm-wrapper {
          min-height: 100vh;
          background: #050a0f;
          display: flex;
          flex-direction: column;
          font-family: 'Exo 2', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .tm-wrapper::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,255,180,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,180,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(0,255,180,0.08) 0%, transparent 70%);
          top: -100px; left: -100px;
          animation: orbFloat 8s ease-in-out infinite;
        }
        .orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(0,180,255,0.07) 0%, transparent 70%);
          bottom: 100px; right: -80px;
          animation: orbFloat 10s ease-in-out infinite reverse;
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }

        .tm-header {
          position: relative;
          z-index: 10;
          padding: 28px 40px 20px;
          border-bottom: 1px solid rgba(0,255,180,0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(5,10,15,0.8);
          backdrop-filter: blur(20px);
        }

        .tm-logo {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .tm-logo-icon {
          width: 42px; height: 42px;
          border: 2px solid #00ffb4;
          display: flex; align-items: center; justify-content: center;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
          background: rgba(0,255,180,0.05);
          color: #00ffb4;
          font-size: 18px;
        }

        .tm-logo-text {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 22px;
          color: #fff;
          letter-spacing: 3px;
          text-transform: uppercase;
        }
        .tm-logo-text span { color: #00ffb4; }

        .tm-header-meta {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: rgba(0,255,180,0.5);
          text-align: right;
          line-height: 1.8;
        }

        .tm-main {
          flex: 1;
          position: relative;
          z-index: 10;
          padding: 40px;
          max-width: 820px;
          margin: 0 auto;
          width: 100%;
        }

        .tm-section-title {
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(0,255,180,0.6);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tm-section-title::before {
          content: '';
          width: 20px; height: 1px;
          background: rgba(0,255,180,0.6);
        }

        .tm-input-panel {
          background: rgba(0,255,180,0.03);
          border: 1px solid rgba(0,255,180,0.15);
          clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
          padding: 28px;
          margin-bottom: 32px;
          position: relative;
        }

        .tm-input-row {
          display: flex;
          gap: 12px;
          align-items: stretch;
        }

        .tm-input {
          flex: 1;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(0,255,180,0.2);
          border-bottom: 2px solid rgba(0,255,180,0.4);
          padding: 14px 18px;
          font-family: 'Exo 2', sans-serif;
          font-size: 15px;
          color: #e0fff5;
          outline: none;
          transition: all 0.2s;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
        }
        .tm-input::placeholder { color: rgba(0,255,180,0.25); }
        .tm-input:focus {
          border-color: rgba(0,255,180,0.6);
          background: rgba(0,255,180,0.05);
          box-shadow: 0 0 20px rgba(0,255,180,0.08);
        }

        .tm-btn {
          background: linear-gradient(135deg, #00ffb4 0%, #00c8ff 100%);
          border: none;
          padding: 14px 28px;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #050a0f;
          cursor: pointer;
          clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
          transition: all 0.2s;
          white-space: nowrap;
        }
        .tm-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(0,255,180,0.35);
        }
        .tm-btn:active { transform: translateY(0); }
        .tm-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .tm-error {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          padding: 10px 14px;
          background: rgba(255,60,80,0.08);
          border-left: 2px solid #ff3c50;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          color: #ff6b7a;
        }

        .tm-counter {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .tm-counter-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 32px;
          color: #00ffb4;
          line-height: 1;
        }
        .tm-counter-label {
          font-family: 'Exo 2', sans-serif;
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-top: 4px;
        }
        .tm-status-dot {
          width: 8px; height: 8px;
          background: #00ffb4;
          border-radius: 50%;
          box-shadow: 0 0 10px #00ffb4;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 10px #00ffb4; }
          50% { opacity: 0.5; box-shadow: 0 0 4px #00ffb4; }
        }
        .tm-status-info {
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
        }
        .tm-status-text {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: rgba(0,255,180,0.5);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tm-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tm-task-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: rgba(0,255,180,0.02);
          border: 1px solid rgba(0,255,180,0.08);
          border-left: 3px solid rgba(0,255,180,0.3);
          transition: all 0.3s ease;
          animation: taskSlideIn 0.4s ease forwards;
        }
        .tm-task-item.new-task {
          border-left-color: #00ffb4;
          background: rgba(0,255,180,0.06);
          box-shadow: 0 0 20px rgba(0,255,180,0.08);
        }
        @keyframes taskSlideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .tm-task-item:hover {
          background: rgba(0,255,180,0.05);
          border-left-color: #00ffb4;
          transform: translateX(3px);
        }

        .tm-task-num {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: rgba(0,255,180,0.35);
          min-width: 28px;
        }

        .tm-task-dot {
          width: 6px; height: 6px;
          border: 1px solid rgba(0,255,180,0.4);
          border-radius: 50%;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .tm-task-item:hover .tm-task-dot {
          background: #00ffb4;
          box-shadow: 0 0 6px #00ffb4;
        }

        .tm-task-title {
          flex: 1;
          font-size: 14px;
          color: rgba(255,255,255,0.85);
          font-weight: 400;
          letter-spacing: 0.3px;
        }

        .tm-task-chevron {
          color: rgba(0,255,180,0.2);
          font-size: 12px;
          transition: all 0.2s;
        }
        .tm-task-item:hover .tm-task-chevron {
          color: rgba(0,255,180,0.6);
          transform: translateX(3px);
        }

        .tm-empty {
          text-align: center;
          padding: 60px 20px;
          border: 1px dashed rgba(0,255,180,0.1);
        }
        .tm-empty-icon {
          font-size: 36px;
          margin-bottom: 16px;
          opacity: 0.3;
          color: #00ffb4;
        }
        .tm-empty-text {
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px;
          color: rgba(0,255,180,0.3);
          letter-spacing: 2px;
        }

        .tm-loading {
          text-align: center;
          padding: 40px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          color: rgba(0,255,180,0.4);
          letter-spacing: 3px;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0.3; }
        }

        .tm-footer {
          position: relative;
          z-index: 10;
          border-top: 1px solid rgba(0,255,180,0.08);
          background: rgba(5,10,15,0.9);
          backdrop-filter: blur(20px);
        }

        .tm-footer-top {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 20px 40px;
          gap: 20px;
          border-bottom: 1px solid rgba(0,255,180,0.05);
        }

        .tm-footer-student {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .tm-footer-name {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: #fff;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .tm-footer-name span { color: #00ffb4; }
        .tm-footer-detail {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: rgba(0,255,180,0.4);
          letter-spacing: 1px;
        }

        .tm-footer-divider {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, transparent, rgba(0,255,180,0.3), transparent);
        }

        .tm-footer-course {
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .tm-footer-course-name {
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .tm-footer-prof {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: rgba(0,255,180,0.4);
          letter-spacing: 1px;
        }

        .tm-footer-bottom {
          padding: 12px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .tm-footer-copy {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: rgba(255,255,255,0.15);
          letter-spacing: 1px;
        }
        .tm-footer-tech {
          display: flex;
          gap: 10px;
        }
        .tm-tech-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          color: rgba(0,255,180,0.3);
          padding: 3px 8px;
          border: 1px solid rgba(0,255,180,0.1);
          letter-spacing: 1px;
        }

        .tm-wrapper::after {
          content: '';
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(0,255,180,0.4), transparent);
          animation: scanLine 4s linear infinite;
          pointer-events: none;
          z-index: 100;
        }
        @keyframes scanLine {
          0% { top: 0; opacity: 1; }
          95% { opacity: 0.5; }
          100% { top: 100vh; opacity: 0; }
        }
      `}</style>

      <div className="tm-wrapper">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <header className="tm-header">
          <div className="tm-logo">
            <div className="tm-logo-icon">◈</div>
            <div className="tm-logo-text">Task<span>Flow</span></div>
          </div>
          <div className="tm-header-meta">
            <div>SYSTEM ACTIVE</div>
            <div>PORT 8000 ◆ PORT 3000</div>
            <div>MYSQL DB ◆ TASKDB</div>
          </div>
        </header>

        <main className="tm-main">
          <div className="tm-section-title">Input Terminal</div>
          <div className="tm-input-panel">
            <div className="tm-input-row">
              <input
                className="tm-input"
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter task description..."
                disabled={adding}
              />
              <button className="tm-btn" onClick={handleAddTask} disabled={adding}>
                {adding ? 'ADDING...' : '+ ADD TASK'}
              </button>
            </div>
            {error && <div className="tm-error">⚠ {error}</div>}
          </div>

          <div className="tm-counter">
            <div>
              <div className="tm-counter-num">{String(tasks.length).padStart(2, '0')}</div>
              <div className="tm-counter-label">Total Tasks</div>
            </div>
            <div className="tm-status-info">
              <div className="tm-status-text"><div className="tm-status-dot" /> LIVE SYNC</div>
              <div className="tm-status-text">LARAVEL API ◆ CONNECTED</div>
            </div>
          </div>

          <div className="tm-section-title">Task Registry</div>

          {loading ? (
            <div className="tm-loading">LOADING TASKS...</div>
          ) : tasks.length === 0 ? (
            <div className="tm-empty">
              <div className="tm-empty-icon">◈</div>
              <div className="tm-empty-text">NO TASKS REGISTERED</div>
            </div>
          ) : (
            <ul className="tm-list">
              {tasks.map((task, index) => (
                <li key={task.id} className={`tm-task-item${task.id === newTaskId ? ' new-task' : ''}`}>
                  <span className="tm-task-num">#{String(index + 1).padStart(2, '0')}</span>
                  <span className="tm-task-dot" />
                  <span className="tm-task-title">{task.title}</span>
                  <span className="tm-task-chevron">›</span>
                </li>
              ))}
            </ul>
          )}
        </main>

        <footer className="tm-footer">
          <div className="tm-footer-top">
            <div className="tm-footer-student">
              <div className="tm-footer-name">CHRISTIAN JOSH S. <span>BELENCION</span></div>
              <div className="tm-footer-detail">SECTION ◆ 3IT-A</div>
            </div>
            <div className="tm-footer-divider" />
            <div className="tm-footer-course">
              <div className="tm-footer-course-name">Applications Development & Emerging Technologies</div>
              <div className="tm-footer-prof">PROF. JOSEPH D. CARTAGENAS</div>
            </div>
          </div>
          <div className="tm-footer-bottom">
            <div className="tm-footer-copy">© 2026 TASKFLOW SYSTEM ◆ UNIVERSITY OF CABUYAO</div>
            <div className="tm-footer-tech">
              <span className="tm-tech-tag">REACT</span>
              <span className="tm-tech-tag">LARAVEL</span>
              <span className="tm-tech-tag">MYSQL</span>
              <span className="tm-tech-tag">DOCKER</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}