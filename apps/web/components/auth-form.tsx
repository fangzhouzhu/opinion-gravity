'use client';

import Link from 'next/link';
import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const endpoint = mode === 'login' ? '/v1/auth/login' : '/v1/auth/register';
  const title = mode === 'login' ? '欢迎回来' : '创建账号';

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
    <main className="auth-page">
      <section className="auth-shell card">
        <header className="auth-head">
          <p className="kicker">观点引力</p>
          <h1>{title}</h1>
          <p className="sub">登录后即可创建辩题、发表观点与参与投票。</p>
        </header>

        <form className="form auth-card" onSubmit={onSubmit}>
          <label>
            用户名
            <input value={username} onChange={(e) => setUsername(e.target.value)} required minLength={2} />
          </label>

          <label>
            密码
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>

          {error ? <p className="error">{error}</p> : null}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? '提交中...' : mode === 'login' ? '登录' : '注册'}
          </button>

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
