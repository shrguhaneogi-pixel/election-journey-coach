# Election Journey Coach

> **A guided civic learning experience that helps people understand the election process step by step, with less confusion and more confidence.**

[Live Demo](https://election-journey-coach--election-journey-coach.us-east4.hosted.app/journey) · [Video Walkthrough](./assets/demo-walkthrough.mp4) · [Source Code](https://github.com/shrguhaneogi-pixel/election-journey-coach)

![Election Journey Coach Screenshot](screenshot.png)

## Why This Matters

Voter education is crucial for democracy. However, many people find the election process confusing, intimidating, or irrelevant to their lives. Election Journey Coach addresses this by:

- breaking down the complex election process into small, manageable steps
- using simple, jargon-free language
- providing personalized guidance based on user needs
- creating a safe, judgment-free space for learning
- making civic education engaging and accessible

## Key Features

### Intuitive Step-by-Step Guidance

The app walks users through the entire election journey in a clear, linear progression:

1. **Onboarding**: Introduces the app and its purpose
2. **Language Selection**: Allows users to choose their preferred language
3. **Timeline**: Visualizes key election dates and deadlines
4. **Checklist**: Provides actionable tasks to complete
5. **Rehearsal**: Simulates the voting experience
6. **Result**: Shows personalized outcomes and next steps

### Multilingual Support

Supports multiple languages to serve diverse communities:

- English
- Spanish
- Arabic
- Bengali
- Hindi
- Urdu
- Simplified Chinese
- Vietnamese

### Interactive Tools & Features

- **Date Calculator**: Automatically calculates key election dates based on user's location
- **Personalized Checklist**: Creates a customized checklist based on user's needs and preferences
- **Voting Simulation**: Simulates the voting process to build confidence
- **Progress Tracking**: Tracks user's progress through the election journey

### Accessibility & Inclusivity

- **Mobile-first design**: Optimized for mobile devices
- **Keyboard navigation**: Fully keyboard accessible
- **Screen reader support**: ARIA labels and proper semantics
- **High-contrast mode**: WCAG AA compliant contrast ratios
- **Reduced motion**: Respects user preferences for reduced motion

### Privacy-Focused Architecture

- **No user tracking**: No cookies, no analytics, no tracking
- **Local-first storage**: Uses browser localStorage only
- **Anonymous usage**: No user accounts or personal data collection
- **Privacy-by-design**: Privacy considerations at every layer

## Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **Testing**: [Vitest](https://vitest.dev), [React Testing Library](https://testing-library.com)
- **PWA**: Next.js PWA plugin
- **Deployment**: [Google Cloud Platform](https://cloud.google.com) (App Engine, Cloud SQL)

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (app)/         # Main application routes
│   │   └── journey/     # Election journey pages
│   ├── api/           # API routes
│   └── layout.tsx       # Root layout
├── components/        # Reusable React components
│   ├── common/          # Common UI components
│   │   ├── CountdownTimer.tsx
│   │   ├── Header.tsx
│   │   ├── LanguageSelector.tsx
│   │   ├── Layout.tsx
│   │   ├── LoadingIndicator.tsx
│   │   ├── ProgressBar.tsx
│   │   └── Sidebar.tsx
│   ├── checklist/     # Checklist components
│   ├── onBoarding/    # Onboarding components
│   ├── rehearsal/     # Rehearsal components
│   ├── steps/         # Step-specific components
│   ├── timeline/      # Timeline components
│   └── ui/            # UI primitives
├── lib/               # Application logic
│   ├── constants.ts   # Constants and configuration
│   ├── journey/       # Journey logic
│   │   ├── journeyConfig.ts
│   │   ├── steps.ts     # Step definitions
│   │   ├── dateCalculator.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── pwa/           # PWA configuration
│   ├── storage.ts     # Local storage utilities
│   └── utils.ts       # General utilities
├── types/             # TypeScript type definitions
│   ├── journey.ts
│   ├── checklist.ts
│   └── common.ts
├── public/            # Public assets
└── styles/            # Global styles
```

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Future Enhancements

- [ ] **Admin Dashboard**: For managing content and configuration
- [ ] **AI-Powered Q&A**: Integrated chatbot for answering user questions
- [ ] **Personalized Recommendations**: Tailored content based on user needs
- [ ] **Community Features**: Share progress and encourage others
- [ ] **Gamification**: Badges, streaks, and rewards
- [ ] **Accessibility Testing**: Automated accessibility audits
- [ ] **Performance Monitoring**: Track performance and optimize
- [ ] **A/B Testing**: Test different approaches to content delivery
- [ ] **Admin Analytics**: Track user engagement and progress
- [ ] **Multi-Region Deployment**: Deploy to multiple regions for lower latency
- [ ] **Advanced Accessibility**: WCAG 2.1 compliance and beyond
- [ ] **Content Management System**: Integrated CMS for managing content
- [ ] **Multilingual Support Expansion**: Add more languages
- [ ] **User Feedback System**: Collect user feedback for improvement
- [ ] **API for Developers**: Allow other applications to integrate
- [ ] **Offline-First Support**: Progressive Web App with full offline support
- [ ] **AI Content Generation**: Generate personalized content automatically
- [ ] **Accessibility Conformance Testing**: Automated accessibility testing
- [ ] **Security Audits**: Regular security assessments
- [ ] **Cross-Browser Testing**: Comprehensive cross-browser compatibility
- [ ] **Internationalization**: Support for different regions and cultures

---

### Live Demo
- **Production / Hosted URL:** https://election-journey-coach--election-journey-coach.us-east4.hosted.app/journey

### Video Walkthrough
- **Video:** `[To Be Added]`

### Screenshots
- **Main Flow:** `./assets/screenshot-1.png`
- **Journey Steps:** `./assets/screenshot-2.png`
- **Mobile View:** `./assets/screenshot-3.png`

### LinkedIn Post
- https://www.linkedin.com/posts/skarlet-undefined-264930405_github-shrguhaneogi-pixelelection-journey-coach-activity-7456598883222081536-iQ_P?utm_source=share&utm_medium=member_desktop&rcm=ACoAAGeK8GwB3EjXhdaD27xmZVuT9UV8Bc_Umy4

---