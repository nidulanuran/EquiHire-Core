# EquiHire — Frontend Design Documentation

**Stack:** React 18 · Vite · Tailwind CSS · WSO2 Asgardeo

---

## Colors

| Name | Value | Used For |
|---|---|---|
| Orange | `#FF7300` | Buttons, active states, brand |
| Black | `#0F0F0F` | Nav bar, dark backgrounds |
| Gray 900 | `#1A1A1A` | Primary text |
| Gray 500 | `#737373` | Muted / helper text |
| Gray 200 | `#E8E8E8` | Borders, dividers |
| White | `#FFFFFF` | Cards, page backgrounds |
| Green | `#16A34A` | Success messages |
| Red | `#DC2626` | Errors, danger actions |

---

## Typography

- **Headings** — Sora, bold (700–800)
- **Body text** — Sora, regular (400), 14px
- **Code & paths** — JetBrains Mono, 12–13px

---

## Pages

### Recruiter Area *(login required)*

| Page | Purpose |
|---|---|
| Dashboard | Overview of jobs, invites, and scores |
| Jobs | Create and manage job postings |
| Questions | Add interview questions per job |
| Invitations | Send magic link invites to candidates |
| Candidates | View anonymized candidate results |
| Docs | In-app documentation viewer |

### Candidate Area *(magic link only, no login)*

| Page | Purpose |
|---|---|
| Invite Landing | Validates the magic link token |
| CV Upload | Candidate uploads their PDF resume |
| Assessment | Lockdown exam interface |
| Complete | Confirmation screen after submission |

---

## Components

| Component | Description |
|---|---|
| Button | Variants: primary (orange), secondary, ghost, danger |
| Badge | Status labels: active, pending, expired, completed |
| Card | White box with border and subtle shadow |
| Modal | Dialog overlay, three sizes: small / medium / large |
| Input | Text field with orange focus ring, red error ring |
| Avatar | Initials circle, color based on name |
| Toast | Short notification: success, error, warning, info |
| Empty State | Shown when a list has no items yet |

---

## Layout

The recruiter area has a fixed top nav and a left sidebar (240px). Content sits to the right with a max width of 1100px.

The candidate area is minimal — centered on screen, no sidebar, no nav links.

---

## Assessment Lockdown

When the candidate starts the exam the interface enters lockdown mode. It detects tab switching, right-click attempts, copy/paste, and fullscreen exit. Each violation is recorded with a severity level (low, medium, or high) and sent to the backend.

---

## Documentation Viewer

The docs page reads the markdown files directly from the `doc/` folder and renders them with syntax highlighting. A sidebar lists all available documents for quick navigation.

---

## Authentication

Recruiters log in through WSO2 Asgardeo using OIDC. A JWT token is attached to every API request automatically. Candidates do not log in — they access the system only through their unique magic link.

---

## API Connection

All API calls go to the Ballerina gateway at `http://localhost:9092/api`. Services are organized per resource: organizations, jobs, questions, invitations, candidates, and templates.

---

## Folder Overview

| Folder | Contents |
|---|---|
| `components/ui/` | Shared UI components |
| `layouts/` | Recruiter and Candidate layout shells |
| `pages/recruiter/` | All recruiter screens |
| `pages/candidate/` | All candidate screens |
| `pages/docs/` | Documentation viewer |
| `services/` | API call functions |
| `hooks/` | Data-fetching hooks |
| `styles/` | Design tokens and typography |

---

## Figma Reference

[Open Design File →](https://www.figma.com/design/TaOgWINAnWhxziI4Wuzbxh/EquiHire_Design?node-id=0-1&t=QUCryU1bJ3jgnGnA-1)

---

*EquiHire-Core 
