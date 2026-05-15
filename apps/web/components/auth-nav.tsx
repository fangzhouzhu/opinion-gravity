'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000';

type Me = { id: string; username: string };

export function AuthNav() {
  const [user, setUser] = useState<Me | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('og_token');
    if (!token) return;

    fetch(`${API_BASE}/v1/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (!res.ok) throw new Error('not logged');
        const data = await res.json();
        setUser(data.user ?? null);
      })
      .catch(() => {
        localStorage.removeItem('og_token');
        setUser(null);
      });
  }, []);

  async function logout() {
    const token = localStorage.getItem('og_token');
    if (token) {
      await fetch(`${API_BASE}/v1/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    localStorage.removeItem('og_token');
    setUser(null);
    window.location.href = '/';
  }

  return (
    <div className="topbar-wrap">
      <div className="topbar">
        <div className="brand-wrap">
          <div className="brand-logo">OG</div>
          <div>
            <p className="brand-title">观点引力</p>
            <p className="brand-sub">View Gravity</p>
          </div>
        </div>

        <nav className="menu">
          <a className="menu-item active" href="#">发现议题</a>
          <a className="menu-item" href="#">热门观点</a>
          <a className="menu-item" href="#">共鸣榜</a>
          <a className="menu-item" href="#">我的关注</a>
        </nav>

        <div className="top-actions">
          <input className="search" placeholder="搜索议题或观点" />
          {user ? (
            <>
              <span className="hello">你好，{user.username}</span>
              <button className="ghost-btn" type="button" onClick={logout}>退出</button>
              <Link href="/topics/new" className="btn">创建议题</Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="ghost-btn">登录</Link>
              <Link href="/topics/new" className="btn">创建议题</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
