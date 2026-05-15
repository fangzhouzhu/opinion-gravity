export default function FollowingPage() {
  return (
    <main className="simple-page">
      <header className="simple-head">
        <p className="create-kicker">我的关注</p>
        <h1>你关注的议题会出现在这里</h1>
        <p className="sub">后续会把关注的议题、用户和观点更新集中到这个页面。</p>
      </header>

      <section className="empty-panel">
        <h2>暂时还没有关注内容</h2>
        <p className="sub">先去发现议题里看看，遇到想持续观察的讨论再关注它。</p>
        <a className="btn" href="/">去发现议题</a>
      </section>
    </main>
  );
}
