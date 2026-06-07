// Central mock data — replace with API calls when backend is ready

export const APPLICATIONS = [
  { id: 1, company: 'Google',    role: 'Frontend Engineer',      location: 'Mountain View, CA', status: 'Applied',     dateApplied: 'Mar 12, 2025', priority: 'High',   color: '#4285f4' },
  { id: 2, company: 'Stripe',    role: 'Product Designer',        location: 'Remote',            status: 'Assessment',  dateApplied: 'Mar 10, 2025', priority: 'Medium', color: '#635bff' },
  { id: 3, company: 'Airbnb',    role: 'Backend Developer',       location: 'San Francisco, CA', status: 'Interview',   dateApplied: 'Mar 08, 2025', priority: 'High',   color: '#ff5a5f' },
  { id: 4, company: 'Netflix',   role: 'Data Scientist',          location: 'Los Gatos, CA',     status: 'Offer',       dateApplied: 'Mar 05, 2025', priority: 'Low',    color: '#e50914' },
  { id: 5, company: 'Amazon',    role: 'DevOps Engineer',         location: 'Seattle, WA',       status: 'Saved',       dateApplied: 'Mar 03, 2025', priority: 'Medium', color: '#ff9900' },
  { id: 6, company: 'Figma',     role: 'UX Researcher',           location: 'Remote',            status: 'Rejected',    dateApplied: 'Feb 28, 2025', priority: 'Low',    color: '#a259ff' },
  { id: 7, company: 'Microsoft', role: 'Cloud Architect',         location: 'Redmond, WA',       status: 'Applied',     dateApplied: 'Feb 25, 2025', priority: 'High',   color: '#00a4ef' },
  { id: 8, company: 'Spotify',   role: 'ML Engineer',             location: 'New York, NY',      status: 'Assessment',  dateApplied: 'Feb 22, 2025', priority: 'Medium', color: '#1db954' },
  { id: 9, company: 'Meta',      role: 'Frontend Engineer',       location: 'Menlo Park, CA',    status: 'Saved',       dateApplied: 'Mar 02, 2025', priority: 'Medium', color: '#0866ff' },
  { id: 10,company: 'Shopify',   role: 'UI Developer',            location: 'Remote',            status: 'Saved',       dateApplied: 'Mar 01, 2025', priority: 'Low',    color: '#96bf48' },
  { id: 11,company: 'Atlassian', role: 'Full Stack Dev',          location: 'Sydney, AU',        status: 'Applied',     dateApplied: 'Feb 24, 2025', priority: 'Low',    color: '#0052cc' },
  { id: 12,company: 'Notion',    role: 'Product Designer',        location: 'Remote',            status: 'Interview',   dateApplied: 'May 01, 2025', priority: 'Medium', color: '#000000' },
  { id: 13,company: 'Linear',    role: 'Software Engineer',       location: 'Remote',            status: 'Applied',     dateApplied: 'Apr 28, 2025', priority: 'High',   color: '#5e6ad2' },
  { id: 14,company: 'Vercel',    role: 'Frontend Engineer',       location: 'Remote',            status: 'Offer',       dateApplied: 'Feb 08, 2025', priority: 'Low',    color: '#000000' },
  { id: 15,company: 'Uber',      role: 'Mobile Engineer',         location: 'San Francisco, CA', status: 'Assessment',  dateApplied: 'Feb 20, 2025', priority: 'Medium', color: '#000000' },
]

export const STATUS_COLORS = {
  Saved:      { bg: 'bg-gray-100',    text: 'text-gray-600',   dot: '#9ca3af' },
  Applied:    { bg: 'bg-blue-50',     text: 'text-blue-600',   dot: '#3b82f6' },
  Assessment: { bg: 'bg-purple-50',   text: 'text-purple-600', dot: '#a855f7' },
  Interview:  { bg: 'bg-teal-50',     text: 'text-teal-600',   dot: '#14b8a6' },
  Offer:      { bg: 'bg-green-50',    text: 'text-green-600',  dot: '#22c55e' },
  Rejected:   { bg: 'bg-red-50',      text: 'text-red-500',    dot: '#ef4444' },
}

export const PRIORITY_COLORS = {
  High:   { dot: 'bg-red-500',    text: 'text-red-500' },
  Medium: { dot: 'bg-amber-400',  text: 'text-amber-600' },
  Low:    { dot: 'bg-green-500',  text: 'text-green-600' },
}

export const MONTHLY_DATA = [
  { month: 'Jan', sent: 13, responses: 4 },
  { month: 'Feb', sent: 19, responses: 5 },
  { month: 'Mar', sent: 12, responses: 2 },
  { month: 'Apr', sent: 20, responses: 6 },
  { month: 'May', sent: 16, responses: 4 },
  { month: 'Jun', sent: 24, responses: 7 },
]

export const ACTIVITY_DATA = [
  { month: 'Jan', apps: 8 },
  { month: 'Feb', apps: 14 },
  { month: 'Mar', apps: 13 },
  { month: 'Apr', apps: 21 },
  { month: 'May', apps: 19 },
  { month: 'Jun', apps: 28 },
]