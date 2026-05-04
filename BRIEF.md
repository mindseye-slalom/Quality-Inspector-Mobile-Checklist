# P303 BRIEF - Quality Inspector Mobile Checklist

## Project
- Project: Protogen P303 - Mobile Experience
- Concept: Quality Inspector Mobile Checklist
- Platform: Mobile-first responsive web app (not native)
- Primary Context: Factory floor, one-handed use, standing/walking, bright/noisy environment

## Why This Project
Inspectors need to complete visual and basic dimensional checks quickly without slowing production. Existing workflows are often paper-based or desktop-dependent, which creates delays, incomplete documentation, and weak traceability for defects.

This app focuses on one high-value mobile task: complete and submit an inspection for a unit in under 2 minutes.

## User
### Primary User
Quality Inspector (floor level)

### User Characteristics
- Moves between lines and stations
- Uses phone with one hand
- Works under time pressure
- Needs large, unambiguous controls
- Sometimes wears gloves

## Problem Statement
Quality inspections on the floor are slow or inconsistent when tools are not mobile-first. Inspectors need a fast, structured way to:
1. Select line and unit
2. Complete checklist items
3. Capture evidence for issues
4. Submit a reliable inspection report

## Product Goal
Enable inspectors to complete accurate, documented inspections quickly on mobile while maintaining clear follow-up visibility for flagged and failed items.

## Success Metrics (MVP)
- 90% of inspections completed in <= 2 minutes (excluding photo time when network is slow)
- 100% of failed items include photo evidence before submit
- 95%+ required fields complete at submission
- 0 blocking usability issues in one-handed flow testing

## Confirmed Design Decisions
1. Checklist structure: **B - Categorized sections**
2. Pass/Fail input method: **A - Tap buttons**
3. Photo capture: **C - Required for Fail, optional for Flag**
4. Visual style: **B - Industrial/tool-like**

## Scope
### In Scope (MVP)
- Start new inspection
- Select production line and enter/select unit ID
- Checklist with categorized sections:
  - Visual
  - Dimensional
  - Assembly
  - Electrical
- Per-item status controls: Pass, Fail, Flag
- Conditional issue details for Fail/Flag:
  - Photo capture/upload
  - Quick note
- Submit inspection report
- Recent inspections list (today)
- Flagged items view (follow-up queue)
- Lightweight criteria/tolerance reference

### Out of Scope (MVP)
- Native mobile app
- Voice dictation/transcription pipeline
- Offline sync conflict resolution
- Multi-role admin workflows
- Full analytics dashboard
- Integration with MES/ERP (can be mocked)

## Information Architecture
1. Home
2. New Inspection
3. Checklist (by category)
4. Issue Detail (photo + note)
5. Submit Confirmation
6. Recent Inspections
7. Flagged Items
8. Criteria Reference

## Core User Flows
### Flow 1: Complete Inspection (Primary)
1. Open app
2. Tap New Inspection
3. Select line + enter unit ID
4. Complete categorized checklist
5. For Fail/Flag items, add details
6. Submit report
7. See confirmation and next action (inspect next unit)

### Flow 2: Review Recent Inspections
1. Open Recent Inspections
2. View latest reports
3. Open report summary and statuses

### Flow 3: Follow Up Flags
1. Open Flagged Items
2. Filter by line/time
3. Open item detail to review evidence and note

## Interaction Rules
- Each checklist item must have one status: Pass, Fail, or Flag
- Fail requires:
  - At least one photo
  - Note with minimum 5 characters
- Flag requires:
  - Note with minimum 5 characters
  - Photo optional
- Pass requires no extra input
- Submit is disabled until all checklist items are completed and all validation rules pass

## Screen Requirements
### 1) Home
- Primary CTA: New Inspection
- Secondary actions: Recent, Flags, Criteria
- Quick stats: inspections today, open flags

### 2) New Inspection Setup
- Line selector (dropdown/search)
- Unit ID input (manual + optional scan placeholder)
- Start Inspection button

### 3) Checklist Screen
- Section cards with collapse/expand
- Progress indicator (e.g., 8/12 completed)
- Large thumb-friendly status buttons per item:
  - Pass (green)
  - Fail (red)
  - Flag (amber)
- Sticky footer CTA: Review & Submit

### 4) Issue Detail Modal/Sheet
- Triggered on Fail/Flag
- Photo capture/upload control
- Note field with quick templates (optional)
- Validation feedback inline

### 5) Review & Submit
- Summary counts by status
- Highlight unresolved validation errors
- Submit Inspection button

### 6) Confirmation
- Success message
- Report ID
- Actions: Inspect Next Unit, View Report

### 7) Recent Inspections
- Chronological list
- Status chips and timestamps
- Tap row for detail

### 8) Flagged Items
- Filter chips (line, severity, time)
- Card list with evidence indicator

## Visual Direction (Industrial / Tool-Like)
- Tone: utilitarian, precise, high-contrast, no playful styling
- Color intent:
  - Background: dark neutral steel tones
  - Surface: slightly lighter graphite cards
  - Accents: safety green, warning amber, alert red
- Typography: strong readability, condensed/technical feel for labels, clear hierarchy for actions
- Components: bold outlines, clear touch targets, minimal decorative elements

## Mobile UX Standards
- One-handed reach priority for primary actions
- Minimum touch target: 44x44 px
- Sticky bottom primary actions where appropriate
- Keep text concise for glanceability
- Avoid deep navigation; max 2 levels for core task

## Accessibility Requirements
- Color is not the only status indicator (icons + labels)
- Contrast ratio meets WCAG AA for text and controls
- Focus states visible for keyboard/switch access
- Semantic labels for form fields and buttons
- Error messages are specific and actionable

## Data Model (MVP)
### Inspection
- inspectionId
- timestamp
- inspectorName (or ID)
- lineId
- unitId
- overallStatus
- items[]

### Checklist Item Result
- itemId
- category (Visual/Dimensional/Assembly/Electrical)
- status (Pass/Fail/Flag)
- note
- photos[]

## Technical Approach (Suggested)
- Frontend: React + Vite
- Styling: CSS variables + component-based styles
- State: local component state (MVP) with optional lightweight store
- Data: local JSON/mock API first; upgrade path to backend later
- Camera: mobile file input/camera capture support

## QA / Acceptance Criteria
1. User can start a new inspection with line + unit ID
2. Checklist is grouped into categories and progress is visible
3. Every item can be marked Pass/Fail/Flag via tap buttons
4. Fail enforces photo + note before submit
5. Flag enforces note (photo optional)
6. Submit remains disabled until all rules pass
7. Submitted inspection appears in Recent Inspections
8. Flagged items appear in Flagged Items view
9. Layout and interactions are optimized for phone viewport widths
10. App remains usable in bright-light/high-glare contexts (high contrast)

## Build Plan (5-7 Days)
### Day 1
- Define checklist schema and mock data
- Build app shell + navigation + home

### Day 2
- Implement New Inspection setup and checklist UI
- Add Pass/Fail/Flag interaction states

### Day 3
- Build Issue Detail flow and validation rules
- Add review and submit logic

### Day 4
- Build Recent + Flagged views
- Add criteria reference screen

### Day 5
- Polish visual system and responsive behavior
- Accessibility pass + usability fixes

### Day 6-7 (buffer)
- Bug fixes, testing, and submission prep

## Risks and Mitigations
- Risk: Too many checklist items slow completion
  - Mitigation: Keep MVP to 10-15 high-value checks
- Risk: Photo capture friction
  - Mitigation: Fast camera flow, clear required-state prompts
- Risk: Over-scoping features
  - Mitigation: Freeze MVP scope and track post-MVP ideas separately

## Deliverables for P303 Submission
- Deployed mobile-first web app (password protected)
- Source repo with meaningful commits
- BRIEF.md aligned to final build
- AI scaffolding folder included
- Short demo walkthrough (optional but recommended)

## Portfolio Story Link
This project represents the operational execution layer of your manufacturing quality narrative:
- P302 explained defect patterns and shift trends
- P303 demonstrates how inspectors capture high-quality data at the source
- Future Vision Pro concept can build on this as the next-state workflow
