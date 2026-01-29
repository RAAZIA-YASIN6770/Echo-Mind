# Week 2 Sprint - Quick Reference Guide
## Dark Mode, Micro-Interactions & UI Polish

**Sprint**: Week 2 (Jan 29 - Feb 2, 2026)  
**Business Analyst**: Mary  
**Team**: Frontend Developer, Designer, QA Engineer  

---

## 📋 SPRINT AT A GLANCE

### Goals
1. ✅ Implement professional dark mode with theme toggle
2. ✅ Add Framer Motion micro-interactions to all components
3. ✅ Polish Settings and Tree pages to match HomePage/ChatPage quality

### Metrics
- **Stories**: 13
- **Points**: 38
- **Hours**: 32 (with 8-hour buffer)
- **Duration**: 5 days

---

## 🎯 DAILY BREAKDOWN

### Day 1 (Jan 29) - Dark Mode Foundation
**Stories**: 1.1, 1.2 (5 points, 3.5 hours)
- Create ThemeContext and provider
- Define dark mode color palette
- Test color contrast

### Day 2 (Jan 30) - Dark Mode Implementation
**Stories**: 1.3, 1.4 (7 points, 6 hours)
- Create ThemeToggle component
- Apply dark mode to all pages
- Test theme switching

### Day 3 (Jan 31) - Micro-Interactions
**Stories**: 2.1, 2.2, 2.3 (8 points, 5.5 hours)
- Add button animations
- Add card animations
- Add input animations

### Day 4 (Feb 1) - Settings & Tree Polish
**Stories**: 3.1, 3.2 (10 points, 8 hours)
- Refactor SettingsPage
- Refactor TreePage
- Add micro-interactions

### Day 5 (Feb 2) - Testing & Refinement
**Stories**: 1.5, 2.4, 3.3, 3.4 (8 points, 9 hours)
- Dark mode testing
- Animation testing
- Settings/Tree testing
- Sprint review

---

## 🎨 DARK MODE COLORS

### Light Mode (Current)
```css
--color-bg: #ffffff;
--color-text: #1f2937;
--color-text-secondary: #6b7280;
```

### Dark Mode (New)
```css
--color-bg-dark: #0f172a;           /* Slate 900 */
--color-text-dark: #f1f5f9;         /* Slate 100 */
--color-text-dark-secondary: #cbd5e1; /* Slate 300 */
--color-card-dark: #1e293b;         /* Slate 800 */
```

### Contrast Ratios (WCAG AA)
- Primary text: 15.8:1 ✅
- Secondary text: 8.2:1 ✅
- Accent colors: 4.5:1+ ✅

---

## ✨ ANIMATION SPECS

### Button Animations
```javascript
whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
whileTap={{ scale: 0.98 }}
```

### Card Animations
```javascript
whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: index * 0.1 }}
```

### Input Animations
```javascript
// Error shake
animate={{ x: [-10, 10, -10, 10, 0] }}

// Success checkmark
initial={{ scale: 0, rotate: -180 }}
animate={{ scale: 1, rotate: 0 }}
```

### Timing
- Micro: 150ms
- Short: 300ms
- Medium: 500ms
- Long: 800ms

---

## 📊 SUCCESS METRICS

### Technical
- Accessibility: 92+ (maintain)
- Performance: 78+ (maintain)
- Dark Mode Coverage: 100%
- Animation Coverage: 90%

### User Experience
- User Delight: +30%
- Dark Mode Adoption: 60%
- Visual Consistency: 100%

### Business
- User Retention: +25%
- User Satisfaction: +30%
- Competitive Position: Excellent

---

## ✅ DEFINITION OF DONE

### Story Level
- [ ] Code written and reviewed
- [ ] All acceptance criteria met
- [ ] Accessibility tested (WCAG AA)
- [ ] Performance tested
- [ ] Dark mode tested
- [ ] Cross-browser tested
- [ ] Mobile tested

### Sprint Level
- [ ] All 13 stories completed
- [ ] Dark mode fully functional
- [ ] All components have animations
- [ ] Settings/Tree pages polished
- [ ] Accessibility maintained (92+)
- [ ] Performance maintained (78+)
- [ ] Zero critical bugs

---

## 🚨 RISKS & MITIGATION

1. **Color Contrast**: Test early, use contrast checker
2. **Animation Performance**: Monitor continuously, optimize
3. **Complexity**: 8-hour buffer, prioritize critical features
4. **Cross-Browser**: Test early in all browsers

---

## 📞 COMMUNICATION

### Daily Standup
**Time**: 9:00 AM PKT  
**Duration**: 15 minutes  
**Format**: What/What/Blockers

### Sprint Review
**Date**: Feb 2, 4:00 PM PKT  
**Duration**: 1 hour  
**Attendees**: All stakeholders

### Sprint Retrospective
**Date**: Feb 2, 5:00 PM PKT  
**Duration**: 30 minutes  
**Format**: What went well / What to improve

---

## 🎯 PRIORITY MATRIX

### P0 (Must Have)
- Dark mode on all pages
- Theme toggle
- Settings page refactor
- Tree page refactor
- Accessibility maintained

### P1 (Should Have)
- Button animations
- Card animations
- Input animations
- Page transitions

### P2 (Nice to Have)
- Advanced tree animations
- Custom theme colors
- Animation settings

---

## 📚 RESOURCES

### Documentation
- Week 2 Sprint Plan: `docs/Week2_Sprint_Plan.md`
- Week 1 Completion: `docs/Week1_Sprint_COMPLETE.md`
- Component Library: `frontend/src/components/ui/`

### Tools
- Contrast Checker: WebAIM Contrast Checker
- Animation Inspector: Chrome DevTools
- Accessibility: axe DevTools, Lighthouse

### References
- Framer Motion Docs: https://www.framer.com/motion/
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- Dark Mode Best Practices: Material Design

---

**Week 2 Sprint starts Jan 29, 2026. Let's build amazing dark mode and delightful animations!** 🚀
