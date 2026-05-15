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
    <section className="grid interaction-grid">
      <div className="card interaction-card">
        <h3>立场投票</h3>
        <p className="sub">先选择立场，再投出你的一票。</p>
        <div className="stance-wrap">
          {stances.map((s) => (
            <button
              type="button"
              key={s.id}
              className={`chip ${selectedStanceId === s.id ? 'chip-active' : ''}`}
              onClick={() => setSelectedStanceId(s.id)}
            >
              {s.code}. {s.label}
            </button>
          ))}
        </div>
        <button className="btn" type="button" onClick={submitVote}>
          提交投票
        </button>
      </div>

      <form className="card form interaction-card" onSubmit={submitOpinion}>
        <h3>发表观点</h3>
        <p className="sub">用简短摘要表达你的核心立场。</p>
        <label>
          观点摘要
          <input value={shortText} onChange={(e) => setShortText(e.target.value)} required maxLength={240} />
        </label>

        <label>
          详细论证
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} />
        </label>

        <button className="btn" type="submit">
          发布观点
        </button>
      </form>

      {message ? <p className="sub interaction-message">{message}</p> : null}
    </section>
  );
}
