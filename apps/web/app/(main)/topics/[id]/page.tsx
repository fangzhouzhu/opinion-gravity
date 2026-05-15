import Link from 'next/link';
import { TopicInteractions } from '../../../../components/topic-interactions';

type Stance = { id: string; code: string; label: string; position: number };
type Topic = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
  stances: Stance[];
  stats?: {
    totalVotes: number;
    stanceVotes: { stanceId: string; label: string; count: number }[];
  };
  opinions: {
    id: string;
    shortText: string;
    body?: string;
    stanceId: string;
    createdAt: string;
  }[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000';

async function getTopic(id: string): Promise<Topic | null> {
  const res = await fetch(`${API_BASE}/v1/topics/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function TopicDetailPage({ params }: { params: { id: string } }) {
  const topic = await getTopic(params.id);

  if (!topic) {
    return (
      <main>
        <h1>辩题不存在</h1>
        <Link href="/" className="text-link">返回首页</Link>
      </main>
    );
  }

  return (
    <main>
      <header className="hero">
        <p className="kicker">观点现场</p>
        <h1>{topic.title}</h1>
        <p className="sub">{topic.description}</p>
        <div className="tags">
          {topic.tags.map((tag) => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      </header>

      <section className="card">
        <h3>投票统计（总票数：{topic.stats?.totalVotes ?? 0}）</h3>
        <div className="bars">
          {(topic.stats?.stanceVotes ?? []).map((item) => (
            <div key={item.stanceId}>
              <p className="bar-title">{item.label} · {item.count} 票</p>
              <div className="bar-bg"><div className="bar-fill" style={{ width: `${Math.min(item.count * 12, 100)}%` }} /></div>
            </div>
          ))}
        </div>
      </section>

      <TopicInteractions topicId={topic.id} stances={topic.stances} />

      <section className="grid">
        <h3>最新观点</h3>
        {topic.opinions.map((op) => (
          <article className="card" key={op.id}>
            <p>{op.shortText}</p>
            {op.body ? <p className="sub">{op.body}</p> : null}
          </article>
        ))}
      </section>

      <p className="sub">
        <Link href="/" className="text-link">返回首页</Link>
      </p>
    </main>
  );
}
