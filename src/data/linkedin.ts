export interface LinkedInPost {
  period: string;
  action: string;
  template: string;
}

export const LINKEDIN: LinkedInPost[] = [
  {
    period: 'Week 1',
    action: 'Announce your 90-day journey',
    template: 'Starting my 90-day challenge to get interview-ready for product companies. Building in public — DSA, JS fundamentals, React, machine coding. Follow along. #FrontendDeveloper #LearningInPublic',
  },
  {
    period: 'Week 2',
    action: 'Share a JS concept you learned',
    template: 'Most developers use closures every day without knowing it. Here\'s the makeCounter pattern that clicked everything for me... [paste your code below]',
  },
  {
    period: 'Week 3',
    action: 'Post the event loop diagram you drew',
    template: 'If you can\'t explain the JS event loop, you\'re leaving interview marks on the table. Here\'s the diagram I drew to finally understand it — macro vs microtask queue.',
  },
  {
    period: 'Week 4',
    action: 'Share debounce you wrote from scratch',
    template: 'Built debounce from scratch today — not copy-pasted, written from understanding. Here\'s the implementation and exactly where I use it in real projects.',
  },
  {
    period: 'Week 6',
    action: 'Show your UI build (screenshot)',
    template: 'Built a search + filter component from scratch. No library. Pure React, debounce, checkbox filter pipeline. Here\'s how I approached it and what I learned.',
  },
  {
    period: 'Week 8',
    action: 'Post your machine coding approach',
    template: 'Here\'s how I approach machine coding rounds now. The mistake I used to make: starting with CSS. The fix: data model first, then layout, then interactions.',
  },
  {
    period: 'Week 10',
    action: 'Share interview experience (honest)',
    template: 'Gave a technical interview today. The DSA round asked X. My approach was Y. Result: [honest]. Here\'s what I\'m improving next. [honest posts get 3x the engagement of success posts]',
  },
  {
    period: 'Week 12',
    action: 'Showcase KredBook with demo video',
    template: '6 weeks of building KredBook alongside interview prep. Here\'s what it does, the stack, and the hardest problem I solved. Open to feedback and conversations. [attach your 2-min demo]',
  },
];
