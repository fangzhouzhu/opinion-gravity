import cors from 'cors';
import express from 'express';
import { randomUUID } from 'crypto';

type Stance = { id: string; code: string; label: string; position: number };
type Topic = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: 'open' | 'closed';
  stances: Stance[];
  createdAt: string;
};
type Opinion = {
  id: string;
  topicId: string;
  stanceId: string;
  shortText: string;
  body?: string;
  authorId?: string;
  authorName?: string;
  createdAt: string;
};

type TopicVote = { topicId: string; userId: string; stanceId: string; updatedAt: string };
type OpinionVote = { opinionId: string; userId: string; voteType: 'helpful' | 'insightful' | 'agree' };
type User = { id: string; username: string; password: string; createdAt: string };

const app = express();
const corsOrigin = process.env.CORS_ORIGIN ?? '*';
app.use(cors({ origin: corsOrigin === '*' ? true : corsOrigin }));
app.use(express.json());

const users: User[] = [
  { id: 'u-demo', username: 'demo', password: 'demo123', createdAt: new Date().toISOString() }
];
const sessions = new Map<string, string>();

const topics: Topic[] = [
  {
    id: 't1',
    title: 'AI 会让人类更有创造力吗？',
    description: '讨论 AI 对个体创造力的长期影响。',
    tags: ['AI', '创造力'],
    status: 'open',
    stances: [
      { id: 's1', code: 'A', label: '会增强创造力', position: 1 },
      { id: 's2', code: 'B', label: '会削弱创造力', position: 2 }
    ],
    createdAt: new Date().toISOString()
  }
];

const opinions: Opinion[] = [
  {
    id: 'o1',
    topicId: 't1',
    stanceId: 's1',
    shortText: 'AI 可以降低创作门槛，让更多人开始表达。',
    body: '很多人不是没有想法，而是缺少将想法视觉化、文字化的能力。AI 正好提供这个桥梁。',
    authorId: 'u-demo',
    authorName: 'demo',
    createdAt: new Date().toISOString()
  }
];

const topicVotes: TopicVote[] = [];
const opinionVotes: OpinionVote[] = [];

function authUser(req: express.Request) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  const userId = sessions.get(token);
  if (!userId) return null;
  return users.find((u) => u.id === userId) ?? null;
}

function topicStats(topic: Topic) {
  const map = new Map(topic.stances.map((s) => [s.id, 0]));
  topicVotes.filter((v) => v.topicId === topic.id).forEach((v) => {
    map.set(v.stanceId, (map.get(v.stanceId) ?? 0) + 1);
  });

  const total = Array.from(map.values()).reduce((a, b) => a + b, 0);
  return {
    totalVotes: total,
    stanceVotes: topic.stances.map((s) => ({
      stanceId: s.id,
      label: s.label,
      count: map.get(s.id) ?? 0
    }))
  };
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'opinion-gravity-api' });
});

app.post('/v1/auth/register', (req, res) => {
  const { username, password } = req.body ?? {};
  if (!username || !password) return res.status(400).json({ message: 'username and password are required' });
  if (String(username).length < 2) return res.status(400).json({ message: 'username is too short' });
  if (String(password).length < 6) return res.status(400).json({ message: 'password must be at least 6 chars' });
  if (users.some((u) => u.username.toLowerCase() === String(username).toLowerCase())) {
    return res.status(409).json({ message: 'username already exists' });
  }

  const newUser: User = {
    id: `u-${Date.now()}`,
    username: String(username),
    password: String(password),
    createdAt: new Date().toISOString()
  };
  users.push(newUser);

  const token = randomUUID();
  sessions.set(token, newUser.id);
  return res.status(201).json({ token, user: { id: newUser.id, username: newUser.username } });
});

app.post('/v1/auth/login', (req, res) => {
  const { username, password } = req.body ?? {};
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'invalid credentials' });

  const token = randomUUID();
  sessions.set(token, user.id);
  return res.json({ token, user: { id: user.id, username: user.username } });
});

app.get('/v1/auth/me', (req, res) => {
  const user = authUser(req);
  if (!user) return res.status(401).json({ message: 'unauthorized' });
  return res.json({ user: { id: user.id, username: user.username } });
});

app.post('/v1/auth/logout', (req, res) => {
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) {
    sessions.delete(auth.slice(7));
  }
  return res.json({ ok: true });
});

app.get('/v1/topics', (_req, res) => {
  const items = topics.map((t) => ({ ...t, stats: topicStats(t) }));
  res.json({ items, total: items.length });
});

app.get('/v1/topics/:id', (req, res) => {
  const topic = topics.find((t) => t.id === req.params.id);
  if (!topic) return res.status(404).json({ message: 'Topic not found' });

  const topicOpinions = opinions.filter((o) => o.topicId === topic.id);
  return res.json({ ...topic, stats: topicStats(topic), opinions: topicOpinions });
});

app.post('/v1/topics', (req, res) => {
  const user = authUser(req);
  if (!user) return res.status(401).json({ message: 'please login first' });

  const { title, description = '', tags = [], stanceLabels } = req.body ?? {};
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ message: 'title is required' });
  }

  const labels: string[] = Array.isArray(stanceLabels) && stanceLabels.length >= 2
    ? stanceLabels.filter((x) => typeof x === 'string').slice(0, 4)
    : ['支持', '反对'];

  const stances = labels.map((label, idx) => ({
    id: `s${Date.now()}${idx + 1}`,
    code: String.fromCharCode(65 + idx),
    label,
    position: idx + 1
  }));

  const newTopic: Topic = {
    id: `t${Date.now()}`,
    title,
    description,
    tags: Array.isArray(tags) ? tags : [],
    status: 'open',
    stances,
    createdAt: new Date().toISOString()
  };

  topics.unshift(newTopic);
  return res.status(201).json(newTopic);
});

app.get('/v1/topics/:id/opinions', (req, res) => {
  const items = opinions.filter((o) => o.topicId === req.params.id);
  return res.json({ items, total: items.length });
});

app.post('/v1/topics/:id/opinions', (req, res) => {
  const user = authUser(req);
  if (!user) return res.status(401).json({ message: 'please login first' });

  const { stanceId, shortText, body } = req.body ?? {};
  const topic = topics.find((t) => t.id === req.params.id);

  if (!topic) return res.status(404).json({ message: 'Topic not found' });
  if (!stanceId || !shortText) {
    return res.status(400).json({ message: 'stanceId and shortText are required' });
  }

  const matchedStance = topic.stances.find((s) => s.id === stanceId);
  if (!matchedStance) return res.status(400).json({ message: 'invalid stanceId' });

  const newOpinion: Opinion = {
    id: `o-${Date.now()}`,
    topicId: req.params.id,
    stanceId,
    shortText,
    body,
    authorId: user.id,
    authorName: user.username,
    createdAt: new Date().toISOString()
  };
  opinions.unshift(newOpinion);

  return res.status(201).json(newOpinion);
});

app.post('/v1/topics/:id/vote', (req, res) => {
  const user = authUser(req);
  if (!user) return res.status(401).json({ message: 'please login first' });

  const { stanceId } = req.body ?? {};
  const topic = topics.find((t) => t.id === req.params.id);

  if (!topic) return res.status(404).json({ message: 'Topic not found' });
  if (!stanceId) return res.status(400).json({ message: 'stanceId is required' });
  if (!topic.stances.some((s) => s.id === stanceId)) {
    return res.status(400).json({ message: 'invalid stanceId' });
  }

  const existing = topicVotes.find((v) => v.topicId === topic.id && v.userId === user.id);
  if (existing) {
    existing.stanceId = stanceId;
    existing.updatedAt = new Date().toISOString();
  } else {
    topicVotes.push({
      topicId: topic.id,
      userId: user.id,
      stanceId,
      updatedAt: new Date().toISOString()
    });
  }

  return res.json({ topicId: topic.id, userId: user.id, stanceId, stats: topicStats(topic) });
});

app.post('/v1/opinions/:id/vote', (req, res) => {
  const user = authUser(req);
  if (!user) return res.status(401).json({ message: 'please login first' });

  const { voteType } = req.body ?? {};
  const opinion = opinions.find((o) => o.id === req.params.id);

  if (!opinion) return res.status(404).json({ message: 'Opinion not found' });
  if (!voteType || !['helpful', 'insightful', 'agree'].includes(voteType)) {
    return res.status(400).json({ message: 'voteType must be helpful|insightful|agree' });
  }

  const existed = opinionVotes.find(
    (v) => v.opinionId === opinion.id && v.userId === user.id && v.voteType === voteType
  );
  if (!existed) {
    opinionVotes.push({ opinionId: opinion.id, userId: user.id, voteType });
  }

  const counts = {
    helpful: opinionVotes.filter((v) => v.opinionId === opinion.id && v.voteType === 'helpful').length,
    insightful: opinionVotes.filter((v) => v.opinionId === opinion.id && v.voteType === 'insightful').length,
    agree: opinionVotes.filter((v) => v.opinionId === opinion.id && v.voteType === 'agree').length
  };

  return res.json({ opinionId: opinion.id, counts });
});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[api] running at http://localhost:${port}`);
});
