const people = [
  { name: '林小北', role: '温和表达者', score: '2.1k', initial: '林' },
  { name: '一只思考鸽', role: '理性分析者', score: '1.8k', initial: '思' },
  { name: '晚风', role: '共情达人', score: '1.6k', initial: '晚' },
  { name: 'Echo', role: '观点收藏家', score: '1.2k', initial: 'E' },
  { name: '阿柒', role: '深度提问者', score: '980', initial: '柒' }
];

export default function ResonancePage() {
  return (
    <main className="simple-page">
      <header className="simple-head">
        <p className="create-kicker">共鸣榜</p>
        <h1>被更多人认同的表达者</h1>
        <p className="sub">共鸣来自观点质量、讨论参与和被收藏的次数。</p>
      </header>

      <section className="rank-panel">
        {people.map((person, index) => (
          <article className="rank-row" key={person.name}>
            <span className="rank-index">{index + 1}</span>
            <span className="rank-avatar">{person.initial}</span>
            <div>
              <h2>{person.name}</h2>
              <p className="sub">{person.role}</p>
            </div>
            <strong>{person.score} 共鸣</strong>
          </article>
        ))}
      </section>
    </main>
  );
}
