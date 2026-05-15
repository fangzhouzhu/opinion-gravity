const hotOpinions = [
  {
    title: 'AI 不是替代创造力，而是放大表达的起点',
    topic: 'AI 会让人类更有创造力吗？',
    stance: '会增强创造力',
    heat: '2.4k',
    summary: '当工具降低门槛，更多原本停在脑海里的想法会被看见。'
  },
  {
    title: '亲密关系里，独立空间不是疏离',
    topic: '恋爱中应该保持独立空间吗？',
    stance: '应该保持',
    heat: '1.9k',
    summary: '稳定的关系并不要求同步每一分钟，它更需要诚实的边界。'
  },
  {
    title: '四天工作制首先是一种效率倒逼',
    topic: '四天工作制会是未来趋势吗？',
    stance: '会成为趋势',
    heat: '1.6k',
    summary: '少工作一天并不自动提高效率，但它会迫使组织重新审视低价值会议。'
  }
];

export default function HotPage() {
  return (
    <main className="simple-page">
      <header className="simple-head">
        <p className="create-kicker">热门观点</p>
        <h1>正在被反复引用的观点</h1>
        <p className="sub">这里汇集近期获得高共鸣、高讨论度的观点。</p>
      </header>

      <section className="simple-list">
        {hotOpinions.map((opinion) => (
          <article className="simple-card" key={opinion.title}>
            <div>
              <p className="simple-meta">{opinion.topic} · {opinion.stance}</p>
              <h2>{opinion.title}</h2>
              <p className="sub">{opinion.summary}</p>
            </div>
            <span className="simple-badge">{opinion.heat} 共鸣</span>
          </article>
        ))}
      </section>
    </main>
  );
}
