'use client';

import Link from 'next/link';
import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000';

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 19.2c1.6-3.5 4-5.2 7.5-5.2s5.9 1.7 7.5 5.2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V8a4 4 0 0 1 8 0v2" />
      <circle cx="12" cy="15" r="1" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M2.5 12s3.2-6 9.5-6 9.5 6 9.5 6-3.2 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  );
}

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const endpoint = mode === 'login' ? '/v1/auth/login' : '/v1/auth/register';
  const title = mode === 'login' ? '欢迎回来' : '创建账号';
  const submitLabel = mode === 'login' ? '登录' : '注册';

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? '操作失败');

      localStorage.setItem('og_token', data.token);
      window.location.href = '/';
    } catch (e) {
      setError(e instanceof Error ? e.message : '操作失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page auth-page-v2">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-dot dot-1" />
      <div className="bg-dot dot-2" />

      <section className="auth-shell auth-shell-v2 card">
        <header className="auth-head auth-head-v2">
          <div className="auth-logo">OG</div>
          <h1>{title}</h1>
          <p className="sub">登录后即可创建辩题、发表观点与参与投票。</p>
        </header>

        <form className="form auth-card" onSubmit={onSubmit}>
          <label>
            用户名
            <div className="input-wrap">
              <span className="input-icon"><UserIcon /></span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={2}
                placeholder="请输入用户名"
              />
            </div>
          </label>

          <label>
            密码
            <div className="input-wrap">
              <span className="input-icon"><LockIcon /></span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="请输入密码"
              />
              <span className="input-icon right"><EyeIcon /></span>
            </div>
          </label>

          {error ? <p className="error">{error}</p> : null}

          <button className="btn auth-submit" type="submit" disabled={loading}>
            {loading ? '提交中...' : submitLabel}
          </button>

          <div className="auth-divider">
            <span>或使用以下方式登录</span>
          </div>

          <div className="oauth-row" aria-hidden="true">
            <button type="button" className="oauth-btn">微</button>
            <button type="button" className="oauth-btn">Q</button>
            <button type="button" className="oauth-btn">G</button>
          </div>

          <p className="sub auth-switch">
            {mode === 'login' ? '没有账号？' : '已有账号？'}
            <Link href={mode === 'login' ? '/auth/register' : '/auth/login'} className="text-link">
              {mode === 'login' ? ' 去注册' : ' 去登录'}
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
