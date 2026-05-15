import Link from 'next/link';

type Topic = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  stats?: {
    totalVotes: number;
    stanceVotes: { stanceId: string; label: string; count: number }[];
  };
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000';

async function getTopics(): Promise<Topic[]> {
  try {
    const res = await fetch(`${API_BASE}/v1/topics`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items ?? [];
  } catch {
    return [];
  }
}

function pct(total: number, count: number) {
  if (!total) return 0;
  return Math.round((count / total) * 100);
}

export default async function HomePage() {
  const topics = await getTopics();

  return (
    <main className="home">
      <section className="hero-v2 card">
        <div className="hero-left">
          <h1>让观点找到同频的人</h1>
          <p className="sub">发起一个问题，收集不同立场，也找到与你共鸣的声音。</p>
          <div className="hero-actions">
            <Link href="/topics/new" className="btn">+ 发起议题</Link>
            <button className="ghost-btn" type="button">随机进入一个讨论</button>
          </div>
          <div className="value-row">
            <div><strong>多元观点</strong><span>看见不同，理解彼此</span></div>
            <div><strong>找到共鸣</strong><span>遇见与你同频的人</span></div>
            <div><strong>理性友善</strong><span>尊重表达，文明讨论</span></div>
          </div>
        </div>

        <div className="hero-right">
          <div className="orbit orbit-a" />
          <div className="orbit orbit-b" />
          <div className="quote-box">“每一种观点，都值得被看见。”</div>
          <img className="avatar-img a1" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" alt="avatar" />
          <img className="avatar-img a2" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop" alt="avatar" />
          <img className="avatar-img a3" src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop" alt="avatar" />
        </div>
      </section>

      <section className="content-grid">
        <div className="left-col card">
          <div className="section-head">
            <h2>正在讨论</h2>
            <div className="chips">
              <span className="chip chip-active">全部</span>
              <span className="chip">科技</span>
              <span className="chip">生活</span>
              <span className="chip">职场</span>
              <span className="chip">教育</span>
            </div>
          </div>

          <div className="topic-list">
            {topics.map((topic) => {
              const total = topic.stats?.totalVotes ?? 0;
              const [a, b, c] = topic.stats?.stanceVotes ?? [];
              const aPct = pct(total, a?.count ?? 0);
              const bPct = pct(total, b?.count ?? 0);
              const cPct = pct(total, c?.count ?? 0);

              return (
                <article className="topic-card" key={topic.id}>
                  <div className="topic-main">
                    <h3>{topic.title}</h3>
                    <p className="sub">{topic.description}</p>
                    <div className="tags">
                      {topic.tags.map((tag) => (
                        <span className="tag" key={tag}>#{tag}</span>
                      ))}
                    </div>
                    <p className="sub tiny">{total} 人参与</p>
                  </div>

                  <div className="topic-right">
                    <div className="bars">
                      <div>
                        <p className="bar-title">正方 {aPct}%</p>
                        <div className="bar-bg"><div className="bar-fill green" style={{ width: `${aPct}%` }} /></div>
                      </div>
                      <div>
                        <p className="bar-title">反方 {bPct}%</p>
                        <div className="bar-bg"><div className="bar-fill orange" style={{ width: `${bPct}%` }} /></div>
                      </div>
                      <div>
                        <p className="bar-title">中立 {cPct}%</p>
                        <div className="bar-bg"><div className="bar-fill gray" style={{ width: `${cPct}%` }} /></div>
                      </div>
                    </div>
                    <Link className="enter-btn" href={`/topics/${topic.id}`}>进入观点引力</Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="right-col">
          <section className="card side-card">
            <div className="side-head">
              <h3>共鸣榜</h3>
              <a className="text-link" href="#">查看全部</a>
            </div>
            <ol className="rank-list">
              <li><span>1</span><b>林小北</b><em>2.1k 共鸣</em></li>
              <li><span>2</span><b>一只思考鸽</b><em>1.8k 共鸣</em></li>
              <li><span>3</span><b>晚风</b><em>1.6k 共鸣</em></li>
              <li><span>4</span><b>Echo</b><em>1.2k 共鸣</em></li>
              <li><span>5</span><b>阿柒</b><em>980 共鸣</em></li>
            </ol>
          </section>

          <section className="card side-card quote-side">
            <h3>今日灵感</h3>
            <p>不是所有观点都要被统一，但所有观点都值得被尊重。</p>
          </section>
        </aside>
      </section>
    </main>
  );
}
