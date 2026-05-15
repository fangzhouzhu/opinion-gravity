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

  const totalVotes = topic.stats?.totalVotes ?? 0;

  return (
    <main className="topic-scene-page">
      <section className="topic-scene-hero">
        <div className="topic-scene-copy">
          <p className="create-kicker">观点现场</p>
          <h1>{topic.title}</h1>
          <p className="sub">{topic.description || '分享你的立场，表达真实想法，让更多人看到你的观点。'}</p>
          <div className="tags">
            {topic.tags.map((tag) => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="topic-scene-visual" aria-hidden="true">
          <div className="scene-note">
            <span />
            <span />
            <span />
          </div>
          <div className="scene-pencil" />
          <div className="scene-bubble bubble-a" />
          <div className="scene-bubble bubble-b" />
        </div>

        <div className="vote-stat-card">
          <h3>投票统计 <span>（总票数：{totalVotes}）</span></h3>
          <div className="scene-stat-list">
            {(topic.stats?.stanceVotes ?? []).map((item, index) => {
              const percent = totalVotes ? Math.round((item.count / totalVotes) * 100) : 0;
              return (
                <div className="scene-stat-row" key={item.stanceId}>
                  <span className={`scene-letter ${index === 1 ? 'orange' : ''}`}>{String.fromCharCode(65 + index)}</span>
                  <strong>{item.label}</strong>
                  <em>{item.count} 票</em>
                  <b>{percent}%</b>
                  <div className="scene-stat-bar">
                    <i style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="scene-participants">已有 <strong>{totalVotes}</strong> 人参与投票</p>
        </div>
      </section>

      <TopicInteractions topicId={topic.id} stances={topic.stances} />

      <section className="scene-opinions">
        <h3>最新观点</h3>
        <div className="scene-opinion-list">
          {topic.opinions.map((op) => (
            <article className="simple-card" key={op.id}>
              <div>
                <p>{op.shortText}</p>
                {op.body ? <p className="sub">{op.body}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
