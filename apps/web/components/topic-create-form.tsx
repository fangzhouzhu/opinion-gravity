'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000';

export function TopicCreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [stanceA, setStanceA] = useState('支持');
  const [stanceB, setStanceB] = useState('反对');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
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
    <form className="card form auth-shell" onSubmit={onSubmit}>
      <label>
        辩题标题
        <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={120} />
      </label>

      <label>
        背景说明
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
      </label>

      <label>
        标签（逗号分隔）
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="AI, 教育, 就业" />
      </label>

      <div className="row2">
        <label>
          立场 A
          <input value={stanceA} onChange={(e) => setStanceA(e.target.value)} required maxLength={20} />
        </label>
        <label>
          立场 B
          <input value={stanceB} onChange={(e) => setStanceB(e.target.value)} required maxLength={20} />
        </label>
      </div>

      {error ? <p className="error">{error}</p> : null}

      <button className="btn" type="submit" disabled={submitting}>
        {submitting ? '创建中...' : '发布辩题'}
      </button>
    </form>
  );
}
