import Link from 'next/link';
import { TopicCreateForm } from '../../../../components/topic-create-form';

export default function TopicNewPage() {
  return (
    <main>
      <header className="hero">
        <p className="kicker">创建你的辩题</p>
        <h1>发起一次有火花的观点实验</h1>
        <p className="sub">写下问题、设置立场、让大家站队并表达真实想法。</p>
        <Link href="/" className="text-link">返回首页</Link>
      </header>

      <TopicCreateForm />
    </main>
  );
}
