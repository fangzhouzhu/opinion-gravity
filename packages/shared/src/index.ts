export type TopicStatus = 'open' | 'closed';

export interface Stance {
  id: string;
  code: string;
  label: string;
  position: number;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: TopicStatus;
  stances: Stance[];
  createdAt: string;
}

export interface Opinion {
  id: string;
  topicId: string;
  stanceId: string;
  shortText: string;
  body?: string;
  createdAt: string;
}
