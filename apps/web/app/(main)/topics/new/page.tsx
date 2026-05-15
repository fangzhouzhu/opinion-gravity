import Link from 'next/link';
import { TopicCreateForm } from '../../../../components/topic-create-form';

export default function TopicNewPage() {
  return (
    <main className="create-topic-page">
      <header className="create-topic-hero">
        <div>
          <p className="create-kicker">创建你的观点实验</p>
          <h1>发起一次有火花的观点实验</h1>
          <p className="sub">写下问题、设置立场，让大家站队并表达真实想法。</p>
          <Link href="/" className="text-link create-back">返回首页</Link>
        </div>

        <div className="create-visual" aria-hidden="true">
          <div className="visual-card">
            <span />
            <span />
            <span />
          </div>
          <div className="visual-leaf" />
          <div className="visual-ring" />
          <i className="visual-dot dot-a" />
          <i className="visual-dot dot-b" />
        </div>
      </header>

      <TopicCreateForm />
    </main>
  );
}
