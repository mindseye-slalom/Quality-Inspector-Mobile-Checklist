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

## Current Feature Set
- Home dashboard with quick actions and daily stats
- Inspection setup with line selector and unit ID input
- Categorized checklist (Visual, Dimensional, Assembly, Electrical)
- Category icons in checklist headers
- Per-item status controls (Pass, Fail, Flag)
- Conditional detail modal for Fail/Flag evidence
- Completion progress bar with completion count
- Review and submit flow with validation summary
- Confirmation screen after successful submission
- Recent inspections list with:
	- Complete vs In Progress state indicator
	- Progress counts per inspection
	- Filter controls (`All`, `In Progress`, `Complete`)
- Flagged items queue with status tag pinned top-right
- Criteria reference list with:
	- Per-criteria SVG illustrations
	- Category tags in the top-right of each criteria card

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

## Repository Files Check
- `README.md` present and updated
- `LICENSE` present

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

## License
This project is licensed under the MIT License. See `LICENSE` for details.

## Submission Checklist
- [ ] App deployed and reachable
- [ ] Password protection enabled
- [ ] BRIEF.md matches built functionality
- [ ] .claude folder included
- [ ] Commit history is clean and meaningful
- [ ] Submitted via Workday Microsoft Form
