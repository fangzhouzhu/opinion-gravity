'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000';

function FieldIcon({ type }: { type: 'title' | 'body' | 'tag' | 'scale' | 'send' }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

  if (type === 'body') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M7 4h7l4 4v12H7z" />
        <path {...common} d="M14 4v5h5" />
        <path {...common} d="M9.5 13h5" />
        <path {...common} d="M9.5 16h6" />
      </svg>
    );
  }

  if (type === 'tag') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M4 10V5h5l10 10-5 5z" />
        <path {...common} d="M8 8h.01" />
      </svg>
    );
  }

  if (type === 'scale') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="M12 4v16" />
        <path {...common} d="M5 7h14" />
        <path {...common} d="M7 7l-3 6h6z" />
        <path {...common} d="M17 7l-3 6h6z" />
      </svg>
    );
  }

  if (type === 'send') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path {...common} d="m21 3-8 18-4-8-8-4z" />
        <path {...common} d="M21 3 9 13" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path {...common} d="M9 18c0-5 5-9 10-9 0 6-4 10-10 10H6" />
      <path {...common} d="M9 18c0-4-2-7-5-9" />
    </svg>
  );
}

export function TopicCreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [stanceA, setStanceA] = useState('');
  const [stanceB, setStanceB] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const tagItems = tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 5);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    const token = localStorage.getItem('og_token');
    if (!token) {
      setError('请先登录');
      setSubmitting(false);
      router.push('/auth/login');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/v1/topics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          tags: tagItems,
          stanceLabels: [stanceA, stanceB]
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? '创建失败');
      }

      const topic = await res.json();
      router.push(`/topics/${topic.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : '创建失败');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="card form create-topic-card" onSubmit={onSubmit}>
      <label className="create-field">
        <span className="create-label">
          <FieldIcon type="title" />
          辩题标题 <em>*</em>
        </span>
        <div className="create-input-wrap">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={60}
            placeholder="用一句话概括你想讨论的问题"
          />
          <span className="field-count">{title.length}/60</span>
        </div>
      </label>

      <label className="create-field">
        <span className="create-label">
          <FieldIcon type="body" />
          背景说明
        </span>
        <div className="create-input-wrap">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={300}
            placeholder="补充背景信息、现状或你想引发思考的原因（选填）"
          />
          <span className="field-count textarea-count">{description.length}/300</span>
        </div>
      </label>

      <label className="create-field">
        <span className="create-label">
          <FieldIcon type="tag" />
          标签（选填）
        </span>
        <div className="create-input-wrap">
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="添加相关标签，帮助更多人发现你的议题"
          />
          <span className="field-count">{tagItems.length}/5</span>
        </div>
      </label>

      <div className="stance-section">
        <span className="create-label">
          <FieldIcon type="scale" />
          立场设置
        </span>
        <div className="stance-pair">
          <label>
            <span>立场 A</span>
            <input
              value={stanceA}
              onChange={(e) => setStanceA(e.target.value)}
              required
              maxLength={20}
              placeholder="例如：支持 / 赞成 / 应该"
            />
          </label>
          <div className="vs-badge">VS</div>
          <label>
            <span>立场 B</span>
            <input
              className="stance-b"
              value={stanceB}
              onChange={(e) => setStanceB(e.target.value)}
              required
              maxLength={20}
              placeholder="例如：反对 / 不赞成 / 不应该"
            />
          </label>
        </div>
      </div>

      {error ? <p className="error">{error}</p> : null}

      <button className="btn create-submit" type="submit" disabled={submitting}>
        <FieldIcon type="send" />
        {submitting ? '创建中...' : '发布辩题'}
      </button>
    </form>
  );
}
