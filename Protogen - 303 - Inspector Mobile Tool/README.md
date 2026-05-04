# P303 - Inspector Mobile Tool

Mobile-first quality inspection web app for Protogen P303.

## Project Focus
- Primary user: Manufacturing quality inspector
- Core task: Complete an inspection checklist quickly on phone
- Input pattern: Pass, Fail, Flag with conditional evidence
- Validation rule: Fail requires note + photo, Flag requires note

## Stack
- React + Vite
- CSS variables and component-level styling

## Local Development
1. Install dependencies
	- npm install
2. Run dev server
	- npm run dev
3. Build production bundle
	- npm run build
4. Preview production build
	- npm run preview

## Implemented Screens
- Home dashboard
- New inspection setup
- Categorized checklist (Visual, Dimensional, Assembly, Electrical)
- Issue detail modal for Fail and Flag items
- Review and submit
- Confirmation
- Recent inspections
- Flagged items
- Criteria reference

## MVP Acceptance Highlights
- Checklist items require status selection before submit
- Fail cannot be submitted without note and at least one photo
- Flag cannot be submitted without note
- Submit stays disabled until all rules pass
- One-handed mobile layout with large tap targets

## Deployment Notes (Vercel)
1. Push repo to GitHub
2. Import project into Vercel
3. Set framework preset to Vite (auto-detected)
4. Deploy and verify mobile viewport behavior
5. Enable password protection for reviewer access

## Submission Checklist
- [ ] App deployed and reachable
- [ ] Password protection enabled
- [ ] BRIEF.md matches built functionality
- [ ] .claude folder included
- [ ] Commit history is clean and meaningful
- [ ] Submitted via Workday Microsoft Form
