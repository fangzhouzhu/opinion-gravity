'use client';

import { useState } from 'react';

type Stance = { id: string; label: string; code: string; position: number };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000';

export function TopicInteractions({ topicId, stances }: { topicId: string; stances: Stance[] }) {
  const [selectedStanceId, setSelectedStanceId] = useState(stances[0]?.id ?? '');
  const [shortText, setShortText] = useState('');
  const [body, setBody] = useState('');
  const [message, setMessage] = useState('');

  function getToken() {
    const token = localStorage.getItem('og_token');
    if (!token) {
      setMessage('请先登录后再参与');
      return null;
    }
    return token;
  }

  async function submitVote() {
    const token = getToken();
    if (!token) return;

    setMessage('提交中...');
    const res = await fetch(`${API_BASE}/v1/topics/${topicId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ stanceId: selectedStanceId })
    });

    if (!res.ok) {
      const data = await res.json();
      setMessage(data.message ?? '投票失败');
      return;
    }

    setMessage('投票成功，刷新后可看到最新统计。');
  }

  async function submitOpinion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getToken();
    if (!token) return;

    setMessage('提交中...');

    const res = await fetch(`${API_BASE}/v1/topics/${topicId}/opinions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ stanceId: selectedStanceId, shortText, body })
    });

    if (!res.ok) {
      const data = await res.json();
      setMessage(data.message ?? '观点发布失败');
      return;
    }

    setShortText('');
    setBody('');
    setMessage('观点已发布，刷新后可见。');
  }

  return (
    <section className="scene-interaction">
      <div className="scene-compose card">
        <div className="scene-vote-panel">
          <div className="scene-step-title">
            <span>1</span>
            <h3>立场投票</h3>
          </div>
          <p className="sub">先选择立场，再投出你的一票</p>
          <div className="scene-stance-options">
            {stances.map((s, index) => (
              <button
                type="button"
                key={s.id}
                className={`scene-stance-card ${selectedStanceId === s.id ? 'active' : ''} ${index === 1 ? 'warm' : ''}`}
                onClick={() => setSelectedStanceId(s.id)}
              >
                <span>{s.code}</span>
                <strong>{s.label}</strong>
              </button>
            ))}
          </div>
          <button className="btn scene-vote-submit" type="button" onClick={submitVote}>
            提交投票
          </button>
        </div>

        <form className="scene-opinion-panel" onSubmit={submitOpinion}>
          <div className="scene-step-title">
            <span>2</span>
            <h3>发表观点</h3>
          </div>
          <p className="sub">用简短摘要表达你的核心立场，让大家快速理解你的观点</p>

          <label className="scene-field">
            <span>观点摘要 <em>*</em></span>
            <div className="create-input-wrap">
              <input
                value={shortText}
                onChange={(e) => setShortText(e.target.value)}
                required
                maxLength={60}
                placeholder="用一句话概括你的核心观点（建议 10-30 字）"
              />
              <span className="field-count">{shortText.length}/60</span>
            </div>
          </label>

          <label className="scene-field">
            <span>详细论证 <em>*</em></span>
            <div className="create-input-wrap">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                maxLength={500}
                placeholder="详细阐述你的理由、论据或亲身经历，帮助大家理解和认同你的观点..."
              />
              <span className="field-count textarea-count">{body.length}/500</span>
            </div>
          </label>

          {message ? <p className="sub interaction-message">{message}</p> : null}

          <div className="scene-submit-bar">
            <div className="scene-kind-note">
              <span>?</span>
              <div>
                <strong>真诚表达，友善讨论</strong>
                <p className="sub">尊重不同观点，是一场有价值对话的开始</p>
              </div>
            </div>
            <button className="btn scene-publish-submit" type="submit">
              发布观点
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
