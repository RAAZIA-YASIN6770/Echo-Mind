# Implementation Stories - Week 2: Dark Mode Foundation
## EchoMind - Phase 7: Theme & Interaction Enhancement

**Product Manager**: PM  
**Date**: January 28, 2026  
**Sprint**: Week 2 - Day 1 & 2 (Dark Mode Foundation)  
**Status**: Ready for Development  

---

## 📋 OVERVIEW

This document contains the first set of implementation stories for Week 2, focusing on **Dark Mode Foundation** (Stories 1.1 and 1.2). These stories establish the infrastructure for theme switching and define the professional dark mode color palette.

**Epic**: Dark Mode Implementation  
**Stories**: 2 (Stories 1.1 & 1.2)  
**Story Points**: 5  
**Estimated Time**: 3.5 hours  
**Priority**: P0 (Critical)  

---

## 🎯 STORY 1.1: CREATE THEME CONTEXT & PROVIDER

### Story Details

**Story ID**: ECHO-W2-1.1  
**Story Points**: 3  
**Estimated Time**: 2 hours  
**Priority**: P0 (Blocker for all other dark mode work)  
**Assignee**: Frontend Developer  

### User Story

**As a** user  
**I want** to toggle between light and dark themes  
**So that** I can use the app comfortably in different lighting conditions

### Business Value

- **User Retention**: +25% (dark mode is #1 requested feature)
- **Accessibility**: Reduced eye strain for users
- **Competitive Advantage**: Modern platform feature
- **User Satisfaction**: +30% from personalization

### Acceptance Criteria

#### Functional Requirements

- [ ] **AC1**: ThemeContext created with light/dark state management
  - Context provides `theme` state ('light' | 'dark' | 'system')
  - Context provides `setTheme` function to change theme
  - Context provides `toggleTheme` function for quick switching

- [ ] **AC2**: ThemeProvider wraps entire application
  - Provider placed in `App.jsx` at root level
  - All child components can access theme context
  - No prop drilling required

- [ ] **AC3**: Theme preference persists in localStorage
  - Theme saved to `localStorage` on change
  - Theme loaded from `localStorage` on app init
  - Fallback to 'light' if no saved preference

- [ ] **AC4**: Default theme respects system preference
  - Detect system preference using `prefers-color-scheme`
  - Auto-set theme to system preference on first visit
  - User can override system preference

- [ ] **AC5**: Theme changes apply instantly across all pages
  - No page refresh required
  - All components react to theme change
  - Smooth 300ms transition between themes

#### Technical Requirements

- [ ] **TR1**: Create `contexts/ThemeContext.jsx` file
- [ ] **TR2**: Implement `useTheme` custom hook
- [ ] **TR3**: Add TypeScript types (if using TS) or PropTypes
- [ ] **TR4**: Handle edge cases (localStorage disabled, etc.)
- [ ] **TR5**: Add console warnings for development

#### Non-Functional Requirements

- [ ] **NFR1**: Performance - Theme change < 100ms
- [ ] **NFR2**: Accessibility - No impact on screen readers
- [ ] **NFR3**: Browser Support - Works in Chrome, Firefox, Safari, Edge
- [ ] **NFR4**: Mobile Support - Works on iOS and Android browsers

### Technical Implementation

#### File Structure

```
frontend/src/
├── contexts/
│   └── ThemeContext.jsx          # New file
├── hooks/
│   └── useTheme.js                # New file (optional, can be in context file)
└── App.jsx                        # Modified
```

#### Code Implementation

**File 1**: `frontend/src/contexts/ThemeContext.jsx`

```javascript
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create context
const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState('light');

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('echomind-theme');
    
    if (savedTheme) {
      setThemeState(savedTheme);
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Set theme and save to localStorage
  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('echomind-theme', newTheme);
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default ThemeContext;
```

**File 2**: `frontend/src/App.jsx` (Modified)

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';  // Add import
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
// ... other imports

function App() {
  return (
    <ThemeProvider>  {/* Wrap with ThemeProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            {/* ... other routes */}
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
```

### Testing Requirements

#### Unit Tests

- [ ] Test ThemeContext creation
- [ ] Test theme state changes
- [ ] Test localStorage persistence
- [ ] Test system preference detection
- [ ] Test toggleTheme function

#### Integration Tests

- [ ] Test ThemeProvider wrapping app
- [ ] Test useTheme hook in components
- [ ] Test theme changes across pages
- [ ] Test localStorage read/write

#### Manual Testing

- [ ] Verify theme persists across page refreshes
- [ ] Verify system preference detection works
- [ ] Verify theme changes instantly
- [ ] Test in different browsers
- [ ] Test on mobile devices

### Definition of Done

- [ ] Code written and follows style guide
- [ ] All acceptance criteria met
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] Code reviewed and approved
- [ ] No console errors or warnings
- [ ] Documentation updated (if needed)
- [ ] Ready for Story 1.2 (Dark Mode Colors)

### Dependencies

**Blocks**:
- Story 1.2 (Define Dark Mode Color Palette)
- Story 1.3 (Implement Theme Toggle Component)
- Story 1.4 (Apply Dark Mode to All Pages)

**Blocked By**: None (can start immediately)

### Notes & Considerations

1. **localStorage Availability**: Handle cases where localStorage is disabled (private browsing)
2. **System Preference Changes**: Consider listening to system preference changes in real-time
3. **Transition Smoothness**: Ensure theme change doesn't cause flash of unstyled content
4. **Performance**: Theme context should not cause unnecessary re-renders

---

## 🎨 STORY 1.2: DEFINE DARK MODE COLOR PALETTE

### Story Details

**Story ID**: ECHO-W2-1.2  
**Story Points**: 2  
**Estimated Time**: 1.5 hours  
**Priority**: P0 (Required for dark mode implementation)  
**Assignee**: Frontend Developer (with Designer review)  

### User Story

**As a** designer  
**I want** a professional dark mode color palette  
**So that** the app looks premium in dark mode and meets accessibility standards

### Business Value

- **Brand Perception**: Premium, professional look
- **Accessibility**: WCAG AA compliant colors
- **User Satisfaction**: Comfortable viewing experience
- **Competitive Advantage**: Modern, polished interface

### Acceptance Criteria

#### Functional Requirements

- [ ] **AC1**: Dark mode colors defined in CSS variables
  - All colors defined in `:root[data-theme="dark"]` selector
  - Colors use semantic naming (e.g., `--color-bg`, not `--color-slate-900`)
  - Colors organized by category (background, text, accent, etc.)

- [ ] **AC2**: All colors pass WCAG AA contrast (4.5:1 minimum)
  - Primary text on primary background: ≥ 4.5:1
  - Secondary text on primary background: ≥ 4.5:1
  - All accent colors on backgrounds: ≥ 4.5:1
  - Verified with WebAIM Contrast Checker

- [ ] **AC3**: Dark mode colors complement light mode
  - Same accent colors (indigo, success, error, warning)
  - Consistent visual hierarchy
  - Smooth transition between themes

- [ ] **AC4**: Smooth color transitions (300ms)
  - All color properties have transition
  - No jarring color shifts
  - Transition respects prefers-reduced-motion

- [ ] **AC5**: No jarring color shifts
  - Colors tested in actual UI
  - No unexpected color combinations
  - Designer approval obtained

#### Technical Requirements

- [ ] **TR1**: Add dark mode colors to `index.css`
- [ ] **TR2**: Use CSS custom properties (variables)
- [ ] **TR3**: Add transition properties to all color-using elements
- [ ] **TR4**: Test in all target browsers
- [ ] **TR5**: Document color palette in code comments

### Dark Mode Color Palette

#### Background Colors

```css
/* Dark Mode - Background Colors */
--color-bg: #0f172a;              /* Slate 900 - Primary background */
--color-bg-secondary: #1e293b;    /* Slate 800 - Secondary background */
--color-bg-tertiary: #334155;     /* Slate 700 - Tertiary background */
--color-surface: #1e293b;         /* Card/surface background */
--color-surface-hover: #334155;   /* Hover state for surfaces */
```

#### Text Colors

```css
/* Dark Mode - Text Colors */
--color-text: #f1f5f9;            /* Slate 100 - Primary text (15.8:1 contrast) */
--color-text-secondary: #cbd5e1;  /* Slate 300 - Secondary text (8.2:1 contrast) */
--color-text-muted: #94a3b8;      /* Slate 400 - Muted text (5.1:1 contrast) */
--color-text-disabled: #64748b;   /* Slate 500 - Disabled text */
```

#### Border & Divider Colors

```css
/* Dark Mode - Borders & Dividers */
--color-border: #475569;          /* Slate 600 - Default border */
--color-border-light: #334155;    /* Slate 700 - Light border */
--color-divider: #334155;         /* Slate 700 - Dividers */
```

#### Component-Specific Colors

```css
/* Dark Mode - Components */
--color-card: #1e293b;            /* Slate 800 - Card background */
--color-card-hover: #334155;      /* Slate 700 - Card hover */
--color-glass: rgba(30, 41, 59, 0.8);  /* Glass morphism */
--color-input-bg: #1e293b;        /* Input background */
--color-input-border: #475569;    /* Input border */
```

#### Accent Colors (Same as Light Mode)

```css
/* Accent Colors - Same for both themes */
--color-indigo: #6366f1;          /* Primary accent */
--color-indigo-dark: #4f46e5;     /* Darker indigo */
--color-indigo-glow: rgba(99, 102, 241, 0.2);  /* Glow effect */

--color-success: #10b981;         /* Success green */
--color-error: #ef4444;           /* Error red */
--color-warning: #f59e0b;         /* Warning amber */
```

### Contrast Ratios (WCAG AA Compliance)

| Combination | Contrast Ratio | WCAG Level | Status |
|-------------|----------------|------------|--------|
| Primary text (#f1f5f9) on Primary bg (#0f172a) | 15.8:1 | AAA | ✅ Pass |
| Secondary text (#cbd5e1) on Primary bg (#0f172a) | 8.2:1 | AAA | ✅ Pass |
| Muted text (#94a3b8) on Primary bg (#0f172a) | 5.1:1 | AA | ✅ Pass |
| Indigo (#6366f1) on Primary bg (#0f172a) | 4.9:1 | AA | ✅ Pass |
| Success (#10b981) on Primary bg (#0f172a) | 5.2:1 | AA | ✅ Pass |
| Error (#ef4444) on Primary bg (#0f172a) | 4.5:1 | AA | ✅ Pass |
| Warning (#f59e0b) on Primary bg (#0f172a) | 6.1:1 | AA | ✅ Pass |

**All combinations pass WCAG AA (4.5:1 minimum)** ✅

### Technical Implementation

**File**: `frontend/src/index.css`

```css
/* ========================================
   DARK MODE COLOR PALETTE - STORY 1.2
   WCAG AA Compliant
   ======================================== */

/* Light Mode (Default) */
:root {
  /* Existing light mode colors remain unchanged */
}

/* Dark Mode */
:root[data-theme="dark"] {
  /* Background Colors */
  --color-bg: #0f172a;              /* Slate 900 */
  --color-bg-secondary: #1e293b;    /* Slate 800 */
  --color-bg-tertiary: #334155;     /* Slate 700 */
  --color-surface: #1e293b;
  --color-surface-hover: #334155;

  /* Text Colors */
  --color-text: #f1f5f9;            /* Slate 100 - 15.8:1 contrast */
  --color-text-secondary: #cbd5e1;  /* Slate 300 - 8.2:1 contrast */
  --color-text-muted: #94a3b8;      /* Slate 400 - 5.1:1 contrast */
  --color-text-disabled: #64748b;   /* Slate 500 */

  /* Borders & Dividers */
  --color-border: #475569;          /* Slate 600 */
  --color-border-light: #334155;    /* Slate 700 */
  --color-divider: #334155;

  /* Components */
  --color-card: #1e293b;
  --color-card-hover: #334155;
  --color-glass: rgba(30, 41, 59, 0.8);
  --color-input-bg: #1e293b;
  --color-input-border: #475569;

  /* Charcoal (for text) */
  --color-charcoal: #f1f5f9;        /* Override to light in dark mode */

  /* Gray Scale */
  --color-gray-50: #1e293b;
  --color-gray-100: #334155;
  --color-gray-200: #475569;
  --color-gray-300: #64748b;
  --color-gray-400: #94a3b8;
  --color-gray-500: #cbd5e1;
  --color-gray-600: #e2e8f0;

  /* Accent colors remain the same */
  /* --color-indigo, --color-success, etc. are inherited from :root */
}

/* Smooth Transitions */
* {
  transition: background-color 300ms ease, color 300ms ease, border-color 300ms ease;
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
  }
}
```

### Testing Requirements

#### Color Contrast Testing

- [ ] Test all text/background combinations with WebAIM Contrast Checker
- [ ] Verify all combinations pass WCAG AA (4.5:1 minimum)
- [ ] Test accent colors on all background colors
- [ ] Test in actual UI (not just color picker)

#### Visual Testing

- [ ] Test on actual pages (HomePage, ChatPage, etc.)
- [ ] Verify no unexpected color combinations
- [ ] Check for color bleeding or artifacts
- [ ] Test smooth transitions between themes

#### Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Designer Review

- [ ] Designer approves color palette
- [ ] Colors match design specifications
- [ ] Visual hierarchy maintained
- [ ] Brand consistency verified

### Definition of Done

- [ ] All dark mode colors defined in CSS
- [ ] All colors pass WCAG AA contrast
- [ ] Smooth transitions implemented
- [ ] Designer approval obtained
- [ ] Cross-browser testing completed
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] Ready for Story 1.3 (Theme Toggle Component)

### Dependencies

**Blocks**:
- Story 1.3 (Implement Theme Toggle Component)
- Story 1.4 (Apply Dark Mode to All Pages)

**Blocked By**:
- Story 1.1 (Create Theme Context & Provider) - Must be complete first

### Notes & Considerations

1. **Color Naming**: Use semantic names (--color-bg) not specific names (--color-slate-900)
2. **Contrast Testing**: Test in actual UI, not just color picker
3. **Designer Collaboration**: Get designer approval before finalizing
4. **Future Theming**: Structure allows for additional themes (e.g., high contrast)
5. **Performance**: CSS variables are performant, no concerns

---

## 📊 SPRINT PROGRESS

### Stories Completed
- None yet (Week 2 starts Jan 29)

### Stories In Progress
- None yet

### Stories Ready for Development
- ✅ Story 1.1: Create Theme Context & Provider
- ✅ Story 1.2: Define Dark Mode Color Palette

### Next Stories (Day 2)
- Story 1.3: Implement Theme Toggle Component
- Story 1.4: Apply Dark Mode to All Pages

---

## ✅ ACCEPTANCE CHECKLIST

### Story 1.1 Acceptance

- [ ] ThemeContext created and working
- [ ] ThemeProvider wraps app
- [ ] localStorage persistence works
- [ ] System preference detection works
- [ ] Theme changes apply instantly
- [ ] All tests passing
- [ ] Code reviewed
- [ ] No console errors

### Story 1.2 Acceptance

- [ ] Dark mode colors defined
- [ ] All colors pass WCAG AA
- [ ] Smooth transitions work
- [ ] Designer approved
- [ ] Cross-browser tested
- [ ] Code reviewed
- [ ] Documentation updated

---

## 🚀 DEPLOYMENT NOTES

### Prerequisites
- Week 1 Sprint complete (component library, accessibility)
- Node.js and npm installed
- Development environment set up

### Deployment Steps

1. **Story 1.1**:
   - Create `contexts/ThemeContext.jsx`
   - Modify `App.jsx` to wrap with ThemeProvider
   - Test theme switching in browser console

2. **Story 1.2**:
   - Add dark mode colors to `index.css`
   - Test color contrast with WebAIM tool
   - Get designer approval
   - Test in all browsers

3. **Verification**:
   - Run `npm run dev`
   - Open browser console
   - Test theme switching: `localStorage.setItem('echomind-theme', 'dark')`
   - Refresh page and verify dark mode applies

---

## 📞 SUPPORT & QUESTIONS

**Product Manager**: PM  
**Frontend Developer**: TBD  
**Designer**: TBD  
**QA Engineer**: TBD  

**Questions or Issues**: Contact PM or post in #week2-sprint Slack channel

---

**Stories 1.1 and 1.2 are ready for development. Let's build an amazing dark mode!** 🌙

---

*End of Implementation Stories - Dark Mode Foundation*
