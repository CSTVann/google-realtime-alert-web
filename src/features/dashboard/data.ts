export type OverviewStat = {
  label: string;
  value: string;
  detail: string;
};

export type TrendSignal = {
  topic: string;
  source: string;
  delta: string;
  strength: string;
  summary: string;
};

export type AlertItem = {
  title: string;
  category: string;
  age: string;
  confidence: string;
  description: string;
};

export type SourceMix = {
  name: string;
  percentage: string;
};

export const overviewStats: OverviewStat[] = [
  {
    label: "Tracked sources",
    value: "128",
    detail: "News, finance, social, and product feeds",
  },
  {
    label: "Median ingest latency",
    value: "2.3s",
    detail: "Fast enough for live monitoring loops",
  },
  {
    label: "High-confidence alerts",
    value: "17",
    detail: "Signals above the active threshold",
  },
  {
    label: "Watchlist coverage",
    value: "94%",
    detail: "Topics mapped to active alert policies",
  },
];

export const trendSignals: TrendSignal[] = [
  {
    topic: "AI hiring",
    source: "Jobs + social mention spikes",
    delta: "+42% in 3h",
    strength: "Strong",
    summary: "Hiring language is clustering around deployment, infra, and agent tooling.",
  },
  {
    topic: "Energy storage",
    source: "Policy + earnings coverage",
    delta: "+18% in 6h",
    strength: "Moderate",
    summary: "Multiple outlets are linking storage demand with grid modernization budgets.",
  },
  {
    topic: "Retail demand",
    source: "Search + transaction chatter",
    delta: "-11% in 24h",
    strength: "Cooling",
    summary: "Attention is flattening after a short-lived promotional spike.",
  },
];

export const alertQueue: AlertItem[] = [
  {
    title: "Search intensity crossed the anomaly band",
    category: "Web trend",
    age: "4m ago",
    confidence: "0.91",
    description: "The signal held above the baseline for three consecutive ingest windows.",
  },
  {
    title: "Regional momentum is spreading across adjacent keywords",
    category: "Geo signal",
    age: "11m ago",
    confidence: "0.88",
    description: "Related terms began moving together after a single source update.",
  },
  {
    title: "Alert threshold likely needs a tighter response window",
    category: "Tuning note",
    age: "23m ago",
    confidence: "0.76",
    description: "Several medium signals are firing just outside the current latency window.",
  },
];

export const sourceMix: SourceMix[] = [
  { name: "News", percentage: "38%" },
  { name: "Search", percentage: "27%" },
  { name: "Social", percentage: "21%" },
  { name: "Internal", percentage: "14%" },
];