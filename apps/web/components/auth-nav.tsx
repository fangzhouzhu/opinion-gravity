'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000';

type Me = { id: string; username: string };

export function AuthNav() {
  const [user, setUser] = useState<Me | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: '发现议题' },
    { href: '/hot', label: '热门观点' },
    { href: '/resonance', label: '共鸣榜' },
    { href: '/following', label: '我的关注' }
  ];

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

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
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
        <Link href="/" className="brand-wrap">
          <div className="brand-logo">OG</div>
          <div>
            <p className="brand-title">观点引力</p>
            <p className="brand-sub">View Gravity</p>
          </div>
        </Link>

        <nav className="menu">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className={`menu-item ${pathname === item.href ? 'active' : ''}`}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="top-actions">
          <input className="search" placeholder="搜索议题或观点" />
          {user ? (
            <div className="user-menu" ref={menuRef}>
              <button
                className="user-trigger"
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
              >
                <span className="user-avatar">{user.username.slice(0, 1).toUpperCase()}</span>
              </button>
              {menuOpen ? (
                <div className="user-dropdown">
                  <Link href="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>个人信息</Link>
                  <Link href="/my-opinions" className="dropdown-item" onClick={() => setMenuOpen(false)}>我的观点</Link>
                  <Link href="/following" className="dropdown-item" onClick={() => setMenuOpen(false)}>我的关注</Link>
                  <button className="dropdown-item danger" type="button" onClick={logout}>退出登录</button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="ghost-btn">登录</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
