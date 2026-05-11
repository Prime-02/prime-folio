# Prime-Folio

**A high-performance, content-rich portfolio platform built with modern web technologies.**

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Architecture & Design Patterns](#architecture--design-patterns)
4. [Project Structure](#project-structure)
5. [Core Features](#core-features)
6. [State Management](#state-management)
7. [Database Schema](#database-schema)
8. [API Layer](#api-layer)
9. [File Upload System](#file-upload-system)
10. [Theming & Styling](#theming--styling)
11. [Admin Dashboard](#admin-dashboard)
12. [Public-Facing Features](#public-facing-features)
13. [Key Design Decisions](#key-design-decisions)
14. [Development Workflow](#development-workflow)
15. [Deployment Considerations](#deployment-considerations)

---

## Overview

**Prime-Folio** is a full-stack, database-driven portfolio application designed for software engineers, designers, and creative professionals who need a sophisticated online presence. It combines a visually stunning public showcase with a fully-featured admin dashboard that enables complete content control without touching code.

The application follows a **content-as-data** philosophy—all text, media, projects, blog posts, testimonials, skills, work history, and social links are stored in a PostgreSQL database and managed through a secure, token-authenticated admin interface. This transforms what is traditionally a static, hard-coded portfolio into a dynamic CMS-backed platform that evolves with the user's career.

The project name "Prime-Folio" reflects its goal: a **prime** (first-rate, best-in-class) **folio** (portfolio) experience.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | Server-side rendering, routing, API routes |
| **Language** | TypeScript | Type safety across the entire stack |
| **Database** | PostgreSQL | Relational data persistence |
| **ORM** | Prisma | Type-safe database access, schema migrations |
| **State Management** | Zustand | Lightweight, scalable client state |
| **Styling** | Tailwind CSS v4 | Utility-first CSS with custom theme variables |
| **File Storage** | Cloudinary | Image upload, optimization, and delivery |
| **Authentication** | JWT (JSON Web Tokens) | Admin session management |
| **Content Format** | MDX / Markdown | Rich text for blog posts and descriptions |
| **Typography** | Montserrat + Poppins | Google Fonts pairing |

---

## Architecture & Design Patterns

### Pattern: Store-First Architecture

Prime-Folio employs a **store-first architecture** where Zustand stores serve as the single source of truth for all application state. Components consume state via granular selectors, minimizing unnecessary re-renders. This pattern provides:

- **Separation of concerns**: Each domain (auth, projects, posts, testimonials, contacts, profile, UI, uploads) has its own dedicated store.
- **Predictable data flow**: Actions → State → Selectors → Components.
- **Persistence**: Critical state (auth tokens, theme preferences) survives page refreshes via `zustand/middleware/persist`.

### Pattern: Granular Selectors

Rather than exposing entire state objects to components, the codebase exports focused selector functions. For example:

```typescript
// Instead of subscribing to the entire auth state:
const token = useAuthStore((s) => s.token);

// Use a dedicated selector:
const token = useAuthStore(selectToken);
```

This prevents re-renders when unrelated state properties change and is enforced by `useShallow` for object-returning selectors.

### Pattern: Token-Based API Security

Admin operations are protected by JWT tokens stored in `localStorage`. The `authFetch` helper automatically attaches `Authorization: Bearer <token>` headers to admin API requests:

```typescript
export function authFetch(token: string | null, url: string, options?: RequestInit): Promise<Response>
```

Public endpoints (projects, testimonials, profile) require no authentication, maintaining a clear separation between read-only public access and write-protected admin operations.

### Pattern: Paginated List Management

Every list-based resource (projects, posts, testimonials, contact messages) implements a consistent pagination interface:

```typescript
interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

Navigation actions (`nextPage`, `previousPage`, `goToPage`) and filter actions (`setFilter`, `clearFilters`) are provided on each store, ensuring a uniform API across all admin views.

### Pattern: Dual Public/Admin State

Some stores (testimonials, contacts) maintain separate state slices for public and admin contexts. Public state holds only approved, published data, while admin state includes pending, archived, and all items regardless of status—keeping the public-facing data clean and the admin data comprehensive.

---

## Project Structure

```
└── 📁prime-folio
    └── 📁app
        └── 📁admin
            └── 📁blog
                └── 📁[slug]
                    └── 📁edit
                        ├── page.tsx
                └── 📁new
                    ├── page.tsx
                ├── page.tsx
            └── 📁contact
                ├── page.tsx
            └── 📁login
                ├── page.tsx
            └── 📁profile
                ├── page.tsx
            └── 📁projects
                └── 📁[slug]
                    └── 📁edit
                        ├── page.tsx
                └── 📁new
                    ├── page.tsx
                ├── page.tsx
            └── 📁testimonials
                ├── page.tsx
            ├── layout.tsx
            ├── page.tsx
        └── 📁api
            └── 📁admin
                └── 📁auth
                    └── 📁login
                        ├── route.ts
                └── 📁contact
                    └── 📁[id]
                        ├── route.ts
                    ├── route.ts
                └── 📁profile
                    └── 📁education
                        └── 📁[id]
                            ├── route.ts
                        ├── route.ts
                    └── 📁experience
                        └── 📁[id]
                            ├── route.ts
                        ├── route.ts
                    └── 📁skills
                        └── 📁[id]
                            ├── route.ts
                        ├── route.ts
                    └── 📁social-links
                        └── 📁[id]
                            ├── route.ts
                        ├── route.ts
                    ├── route.ts
                └── 📁stats
                    ├── route.ts
                └── 📁testimonials
                    └── 📁[id]
                        ├── route.ts
                    ├── route.ts
                └── 📁upload
                    ├── route.ts
            └── 📁blog
                └── 📁[slug]
                    ├── route.ts
                ├── route.ts
            └── 📁contact
                ├── route.ts
            └── 📁profile
                ├── route.ts
            └── 📁projects
                └── 📁[slug]
                    ├── route.ts
                ├── route.ts
            └── 📁testimonials
                ├── route.ts
        └── 📁blog
            └── 📁[slug]
                └── 📁page-components
                    ├── BlogPostContent.tsx
                    ├── BlogPostCover.tsx
                    ├── BlogPostError.tsx
                    ├── BlogPostHero.tsx
                    ├── BlogPostNavigation.tsx
                    ├── BlogPostSkeleton.tsx
                    ├── index.ts
                ├── page.tsx
            └── 📁page-components
                ├── BlogEmpty.tsx
                ├── BlogFilters.tsx
                ├── BlogGrid.tsx
                ├── BlogHero.tsx
                ├── index.ts
            ├── page.tsx
        └── 📁contact
            ├── page.tsx
        └── 📁cv
            ├── page.tsx
        └── 📁projects
            └── 📁[slug]
                └── 📁page-components
                    ├── ContentSection.tsx
                    ├── HeroSection.tsx
                    ├── index.ts
                    ├── MarkdownRenderer.tsx
                    ├── NavigationSection.tsx
                    ├── ProjectError.tsx
                    ├── ProjectSkeleton.tsx
                ├── page.tsx
            └── 📁page-components
                ├── index.ts
                ├── ProjectsEmpty.tsx
                ├── ProjectsFilters.tsx
                ├── ProjectsGrid.tsx
                ├── ProjectsHero.tsx
            ├── page.tsx
        └── 📁testimonials
            └── 📁new
                ├── page.tsx
            ├── page.tsx
        ├── favicon.ico
        ├── globals.css
        ├── layout.tsx
        ├── page.tsx
    └── 📁components
        └── 📁admin
            └── 📁blog
                ├── PostCard.tsx
                ├── PostForm.tsx
            └── 📁contact
                ├── MessageCard.tsx
                ├── MessageFilters.tsx
            └── 📁profile
                └── 📁sections
                    └── 📁education-section-components
                        ├── EducationList.tsx
                        ├── EducationModal.tsx
                    └── 📁experience-section-components
                        ├── ExperienceModal.tsx
                        ├── ExperienceTimeline.tsx
                    └── 📁skills-section-components
                        └── 📁constants
                            ├── index.ts
                        ├── SkillCategorySection.tsx
                        ├── SkillItem.tsx
                        ├── SkillModal.tsx
                    └── 📁social-links-section-components
                        └── 📁constants
                            ├── index.ts
                        ├── SocialLinkList.tsx
                        ├── SocialLinkModal.tsx
                    ├── CoreInfoSection.tsx
                    ├── EducationSection.tsx
                    ├── ExperienceSection.tsx
                    ├── SkillsSection.tsx
                    ├── SocialLinksSection.tsx
                ├── ProdileSidebar.tsx
            └── 📁projects
                ├── ProjectCard.tsx
                ├── ProjectForm.tsx
            └── 📁testimonials
                ├── TestimonialCard.tsx
                ├── TestimonialFilters.tsx
            ├── AdminDashboard.tsx
            ├── AdminHeader.tsx
            ├── AdminShell.tsx
            ├── AdminSidebar.tsx
        └── 📁CVGenerator
            └── 📁cvHtmlBuilder
                ├── index.ts
                ├── sections.ts
                ├── styles.ts
                ├── types.ts
                ├── utils.ts
            ├── constants.ts
            ├── CVConfig.tsx
            ├── CVGenerator.tsx
            ├── CVPreview.tsx
            ├── docxGenerator.ts
            ├── types.ts
        └── 📁portfolio
            └── 📁about-components
                ├── AboutSkeleton.tsx
                ├── animations.ts
                ├── AvailabilityCard.tsx
                ├── BioContent.tsx
                ├── Card.tsx
                ├── CardTitle.tsx
                ├── CurrentRoleCard.tsx
                ├── DetailsCard.tsx
                ├── index.ts
                ├── InfoRow.tsx
            └── 📁blog-components
                ├── animations.ts
                ├── BlogCard.tsx
                ├── BlogGrid.tsx
                ├── BlogImage.tsx
                ├── BlogSkeleton.tsx
                ├── BlogTags.tsx
                ├── index.ts
            └── 📁contact-components
                ├── animations.ts
                ├── ContactForm.tsx
                ├── ContactInfo.tsx
                ├── index.ts
            └── 📁education-components
                ├── animations.ts
                ├── EducationBadge.tsx
                ├── EducationCard.tsx
                ├── EducationSkeleton.tsx
                ├── EducationTimeline.tsx
                ├── index.ts
                ├── InstitutionLogo.tsx
            └── 📁experience-components
                ├── animations.ts
                ├── CompanyLogo.tsx
                ├── ExperienceBadge.tsx
                ├── ExperienceCard.tsx
                ├── ExperienceSkeleton.tsx
                ├── ExperienceTimeline.tsx
                ├── index.ts
            └── 📁hero-components
                ├── animations.ts
                ├── AvailabilityBadge.tsx
                ├── AvailabilityNote.tsx
                ├── constants.ts
                ├── HeroContent.tsx
                ├── HeroPhoto.tsx
                ├── HeroSkeleton.tsx
                ├── index.ts
                ├── MetaItem.tsx
                ├── SocialButton.tsx
            └── 📁projects-components
                ├── animations.ts
                ├── index.ts
                ├── ProjectCard.tsx
                ├── ProjectGrid.tsx
                ├── ProjectImage.tsx
                ├── ProjectsSkeleton.tsx
                ├── ProjectTags.tsx
            └── 📁skills-components
                ├── animations.ts
                ├── index.ts
                ├── ProficiencyBadge.tsx
                ├── SkillCard.tsx
                ├── SkillCategory.tsx
                ├── SkillIcon.tsx
                ├── SkillsSkeleton.tsx
            └── 📁testimonials-components
                ├── animations.tsx
                ├── index.ts
                ├── StarRating.tsx
                ├── TestimonialCard.tsx
                ├── TestimonialForm.tsx
                ├── TestimonialGrid.tsx
                ├── TestimonialsSkeleton.tsx
            ├── AboutSection.tsx
            ├── BlogSection.tsx
            ├── ContactSection.tsx
            ├── EducationSection.tsx
            ├── ExperienceSection.tsx
            ├── HeroSection.tsx
            ├── MainSection.tsx
            ├── ProjectsSection.tsx
            ├── SkillsSection.tsx
            ├── TestiminialsSection.tsx
        └── 📁ui
            └── 📁layout
                ├── Footer.tsx
                ├── index.ts
                ├── MobileMenu.tsx
                ├── Navbar.tsx
            └── 📁markdown
                ├── EditorFooter.tsx
                ├── EditorPane.tsx
                ├── EditorToolbar.tsx
                ├── markdown-utils.ts
                ├── MarkdownEditor.tsx
                ├── MarkdownRenderer.tsx
                ├── PreviewPane.tsx
                ├── styles.ts
                ├── toolbar-config.ts
                ├── ViewTabs.tsx
            ├── Avatar.tsx
            ├── Badge.tsx
            ├── Button.tsx
            ├── Card.tsx
            ├── CloudinaryImage.tsx
            ├── ImageUpload.tsx
            ├── index.ts
            ├── Input.tsx
            ├── Misc.tsx
            ├── Modal.tsx
            ├── Pagination.tsx
            ├── Select.tsx
            ├── Spinner.tsx
            ├── Tabs.tsx
            ├── Textarea.tsx
            ├── ThemeProvider.tsx
            ├── Toast.tsx
            ├── Toggle.tsx
    └── 📁lib
        └── 📁auth
            ├── jwt.ts
            ├── session.ts
        └── 📁cloudinary
            ├── cloudinary.ts
            ├── helpers.ts
            ├── index.ts
        └── 📁db
            ├── prisma.ts
        └── 📁stores
            ├── index.ts
            ├── useAuthStore.ts
            ├── useContactStore.ts
            ├── usePostStore.ts
            ├── useProfileStore.ts
            ├── useProjectStore.ts
            ├── useTestimonialStore.ts
            ├── useUIStore.ts
            ├── useUploadStore.ts
        └── 📁types
            ├── index.ts
        └── 📁validations
            ├── index.ts
            ├── profile.ts
        ├── api-response.ts
    └── 📁prisma
        ├── schema.prisma
        ├── seed.ts
    └── 📁public
        ├── file.svg
        ├── globe.svg
        ├── next.svg
        ├── vercel.svg
        ├── window.svg
    ├── .env
    ├── .gitattributes
    ├── .gitignore
    ├── AGENTS.md
    ├── CLAUDE.md
    ├── eslint.config.mjs
    ├── middleware.ts
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.mjs
    ├── README.md
    ├── tsconfig.json
    └── tsconfig.seed.json
```
---

## Core Features

### 1. Authentication System
- **JWT-based admin login** with persistent sessions
- Hydration-safe state management (`_hasHydrated` flag)
- Automatic token attachment to all admin API requests
- Clear separation between authenticated admin routes and public routes

### 2. Project Portfolio
- CRUD operations with slug-based identification
- Featured project flagging for hero/homepage prominence
- Multi-tag categorization with dynamic tag extraction
- Paginated listing with page navigation
- Filter by tag, featured status, and published status
- Public/private visibility toggle (`published` field)

### 3. Blog Platform
- Markdown/MDX content support via `content` field
- Tag-based categorization system
- Featured post flagging
- Publishing workflow with scheduled `publishedAt` dates
- Paginated post listing with admin "show all" mode
- Slug-based routing for individual post pages

### 4. Testimonial System
- **Public submission form** with name, role, company, content, and rating fields
- **Admin approval workflow**: submissions are `approved: false` by default
- Featured testimonial flagging for homepage display
- Dual view: public sees only approved testimonials, admin sees all
- Pagination on both public and admin views

### 5. Contact Form & Inbox
- Visitor contact form with name, email, subject, and message
- Admin inbox with status tracking: `UNREAD → READ → REPLIED → ARCHIVED`
- Status-based filtering
- Message deletion with smart pagination (auto-navigates to previous page when deleting last item)
- Unread count badge for admin navigation

### 6. Complete Profile Management
- **Single-profile model** (singleton pattern—only one profile row exists)
- Hero section: name, headline, tagline, markdown bio
- Media management: profile photo, cover photo
- Resume/CV upload with configurable label
- Availability status with custom note
- Location data: city, state, country, address, timezone

#### Nested Profile Resources:
- **Skills**: categorized (Frontend, Backend, DevOps, Design) with proficiency levels (Beginner → Expert) and optional icons
- **Work Experience**: company, role, description (markdown), date ranges, current job flag, company logo, company URL
- **Education**: institution, degree, field of study, year ranges, logos
- **Social Links**: platform (GitHub, LinkedIn, Twitter, etc.), URL, icon, order

### 7. File Upload System
- **Direct Cloudinary upload** bypassing server bandwidth limitations
- Real-time progress tracking (0-100%) via XHR `progress` events
- Signed uploads generated server-side for security
- Support for multiple concurrent uploads keyed by field name
- Upload state tracking: `idle → uploading → success/error`
- Delete functionality for removing uploaded assets

### 8. Theming Engine
- **Dark/Light mode** with full CSS custom property implementation
- 50+ semantic color tokens covering backgrounds, text, borders, and brand colors
- Full color palette scales (50-900) for primary, success, warning, error, and info
- Theme persisted in `localStorage`
- `html[data-theme]` attribute-based switching for zero-flash theme changes

### 9. UI Component System (CSS-Only)
- **Complete button system**: 8 variants (primary, secondary, outline, ghost, danger, success, warning, info) + link variant
- **5 button sizes**: xs, sm, md, lg, xl
- **Button states**: hover, active, disabled, focus-visible, loading (with spinner animation)
- **Button modifiers**: full-width, icon (circular), groups, CTA pulse animation
- **Complete select/dropdown system**: custom arrow, 3 variants (filled, outline, ghost), 3 sizes, error/success states, dark mode support
- **Animation utilities**: confetti fall, bounce, spinner

### 10. Toast Notification System
- 4 variants: `success`, `error`, `info`, `warning`
- Auto-dismiss with configurable duration
- Multiple simultaneous toasts with unique IDs
- Convenience helpers: `toast.success()`, `toast.error()`, etc.

### 11. Modal Management
- Centralized modal registry with typed IDs
- Payload passing for contextual modal data
- Single active modal at a time
- Modal IDs: testimonial-form, contact-form, project-form, post-form, delete-confirm

---

## State Management

### Store Inventory

| Store | Purpose | Key State |
|-------|---------|-----------|
| `useAuthStore` | Admin authentication | `token`, `isAuthenticated`, `_hasHydrated` |
| `useProjectStore` | Project portfolio | `projects`, `pagination`, `filters` |
| `usePostStore` | Blog posts | `posts`, `pagination`, `filters` |
| `useTestimonialStore` | Testimonials | `testimonials` (public), `adminTestimonials` |
| `useContactStore` | Contact messages | `messages`, `pagination`, `statusFilter` |
| `useProfileStore` | Personal profile | `profile` (nested skills, experience, etc.) |
| `useUIStore` | UI state | `theme`, `activeModal`, `toasts` |
| `useUploadStore` | File uploads | `uploads` (keyed upload slots) |

### Persistence Strategy

| Store | Persisted Data | Storage Key |
|-------|---------------|-------------|
| `useAuthStore` | `token`, `email`, `isAuthenticated` | `prime-folio-auth` |
| `useUIStore` | `theme` | `prime-folio-ui` |

All other stores are transient (in-memory only) and reset on page refresh.

---

## Database Schema

The Prisma schema defines **8 models** with **2 enums**:

### Models

1. **User** — Admin authentication (`email`, `password`)
2. **Project** — Portfolio projects (`title`, `slug`, `tags`, `featured`, `published`, etc.)
3. **Post** — Blog posts (`title`, `slug`, `content`, `tags`, `publishedAt`, etc.)
4. **Testimonial** — User testimonials (`name`, `content`, `rating`, `approved`, `featured`)
5. **ContactMessage** — Contact form submissions (`name`, `email`, `message`, `status`)
6. **Profile** — Singleton personal profile (all hero/contact/availability fields)
7. **Skill** — Nested under Profile (`name`, `category`, `proficiency`)
8. **Experience** — Nested under Profile (`company`, `role`, `dates`, `current`)
9. **Education** — Nested under Profile (`institution`, `degree`, `years`)
10. **SocialLink** — Nested under Profile (`platform`, `url`)

### Enums

- `MessageStatus`: `UNREAD`, `READ`, `REPLIED`, `ARCHIVED`
- `SkillLevel`: `BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`

### Key Schema Design Decisions

- **Profile is a singleton**: The schema supports one profile row, with all nested resources related via `profileId` foreign keys with `onDelete: Cascade`.
- **String arrays for tags**: PostgreSQL native array columns store tags, avoiding a separate tags table while maintaining queryability.
- **Slug-based routing**: Both projects and posts use unique slugs as URL identifiers.
- **Soft delete avoidance**: `published`/`approved` booleans control visibility rather than physical deletion, preserving data.
- **Date flexibility**: `endDate`/`endYear` are nullable to support current/ongoing positions.

---

## API Layer

The API follows RESTful conventions with Next.js API routes:

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects` | List projects (supports `?tag`, `?featured`, `?page`, `?limit`) |
| `GET` | `/api/projects/:slug` | Get single project |
| `GET` | `/api/blog` | List posts (supports `?tag`, `?featured`, `?page`, `?limit`) |
| `GET` | `/api/blog/:slug` | Get single post |
| `GET` | `/api/testimonials` | List approved testimonials (supports `?featured`, `?page`, `?limit`) |
| `GET` | `/api/profile` | Get full profile with nested resources |
| `POST` | `/api/contact` | Submit contact form |
| `POST` | `/api/testimonials` | Submit testimonial for approval |

### Admin Endpoints (JWT Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/auth/login` | Admin login (returns JWT) |
| `POST` | `/api/blog` | Create blog post |
| `PATCH` | `/api/blog/:slug` | Update blog post |
| `DELETE` | `/api/blog/:slug` | Delete blog post |
| `POST` | `/api/projects` | Create project |
| `PATCH` | `/api/projects/:slug` | Update project |
| `DELETE` | `/api/projects/:slug` | Delete project |
| `POST` | `/api/admin/profile` | Create profile |
| `PATCH` | `/api/admin/profile` | Update profile |
| `POST/` `PATCH`/`DELETE` | `/api/admin/profile/skills[/:id]` | Skills CRUD |
| `POST/` `PATCH`/`DELETE` | `/api/admin/profile/experience[/:id]` | Experience CRUD |
| `POST/` `PATCH`/`DELETE` | `/api/admin/profile/education[/:id]` | Education CRUD |
| `POST/` `PATCH`/`DELETE` | `/api/admin/profile/social-links[/:id]` | Social Links CRUD |
| `GET` | `/api/admin/contact` | List messages (supports `?status`, `?page`, `?limit`) |
| `PATCH` | `/api/admin/contact/:id` | Update message status |
| `DELETE` | `/api/admin/contact/:id` | Delete message |
| `GET` | `/api/admin/testimonials` | List all testimonials (supports `?filter`, `?page`, `?limit`) |
| `PATCH` | `/api/admin/testimonials/:id` | Approve/feature testimonial |
| `DELETE` | `/api/admin/testimonials/:id` | Delete testimonial |
| `POST` | `/api/admin/upload?action=sign` | Get Cloudinary upload signature |
| `DELETE` | `/api/admin/upload` | Delete Cloudinary asset |

---

## File Upload System

The upload system uses a **signed direct upload** architecture:

1. **Client requests a signature** from `/api/admin/upload?action=sign` with the target folder and optional `publicId`
2. **Server generates a Cloudinary signature** using the API secret (never exposed to client)
3. **Client uploads directly to Cloudinary** using `XMLHttpRequest` for real-time progress tracking
4. **Progress is tracked** in the `useUploadStore` keyed by a unique field name
5. **On success**, the `public_id` and `secure_url` are stored in the upload slot

This approach:
- Bypasses server bandwidth limits for large files
- Provides real-time upload progress (0-100%)
- Keeps Cloudinary credentials server-side
- Supports multiple concurrent uploads (e.g., profile photo + cover photo simultaneously)

---

## Theming & Styling

### Design Token Architecture

The theming system uses CSS custom properties with a `data-theme` attribute on `<html>`:

```
html[data-theme="light"] → Light theme tokens
html[data-theme="dark"]  → Dark theme tokens
```

### Color System

Each semantic color has a full 9-step scale (50-900):

- **Primary** (neutral grays): Backgrounds, text, borders
- **Success** (greens): Positive feedback, confirmations
- **Warning** (ambers): Cautions, alerts
- **Error** (reds): Failures, destructive actions
- **Info** (blues): Informational messages

### Typography

- **Headers** (h1-h6): **Montserrat** — clean, geometric, modern
- **Body text**: **Poppins** — highly readable, friendly

Both are loaded from Google Fonts and applied via CSS class-based font family declarations.

### Component Systems

The CSS includes comprehensive, production-ready component styles:

**Button System**:
- 8 variants × 5 sizes = 40+ combinations
- Full state coverage: hover, active, focus-visible, disabled, loading
- Special variants: icon buttons (circular), link buttons, full-width
- Button groups with connected borders
- CTA pulse animation

**Select/Dropdown System**:
- Custom chevron arrow (SVG data URI)
- 3 visual variants: filled, outline, ghost
- 3 sizes: sm, md, lg
- Validation states: error, success
- Dark mode arrow color adaptation
- Full width option

---

## Admin Dashboard

The admin experience is built around these core workflows:

### Content Management
- **Projects**: Create, edit, delete with tag management, cover image upload, featured toggling
- **Blog Posts**: Full markdown editor, tag management, scheduling (publishedAt), featured toggling
- **Profile**: Edit all profile fields, manage skills/experience/education/social links inline

### Communication Management
- **Inbox**: View contact messages, update status (mark as read/replied/archived), delete
- **Testimonials**: Review pending submissions, approve/reject, feature on homepage

### Media Management
- **Upload**: Drag-and-drop or file picker with real-time progress bars
- **Delete**: Remove unused assets from Cloudinary

### Navigation
- Paginated lists with page navigation controls
- Status-based filtering (unread, pending, etc.)
- Tag-based filtering for projects and posts
- "Show All" mode for admin views (includes unpublished/unapproved items)

---

## Public-Facing Features

### Portfolio Page
- Filterable project grid
- Tag-based filtering
- Featured projects highlighted
- Project detail pages with live/repo links

### Blog
- Paginated post listing
- Tag-based filtering
- Featured posts highlighted
- Individual post pages with MDX-rendered content

### About/Profile Section
- Hero with name, headline, tagline
- Skills organized by category with proficiency indicators
- Work experience timeline with company logos
- Education history
- Social links
- Resume/CV download

### Testimonials
- Carousel/grid of approved testimonials
- Star ratings
- Featured testimonials highlighted
- "Submit a testimonial" form for visitors

### Contact
- Contact form with name, email, subject, message
- Success/error feedback
- Server-side validation

### UI/UX
- Dark/Light theme toggle
- Smooth theme transitions
- Responsive mobile menu
- Toast notifications for actions
- Scroll-spy active section tracking

---

## Key Design Decisions

### 1. Zustand over Redux/Context
Zustand was chosen for its minimal boilerplate, excellent TypeScript support, built-in persistence middleware, and granular selector pattern. It avoids the provider wrapping and re-render issues common with React Context.

### 2. Store-First Data Flow
All API responses flow through stores rather than being managed in components. This centralizes data logic, enables cross-component data sharing, and simplifies testing.

### 3. Granular Selectors Everywhere
Every store exports dedicated selector functions. Components subscribe to exactly the data they need, preventing cascading re-renders when unrelated state changes.

### 4. Hydration Safety
The auth store includes a `_hasHydrated` flag with a `setHasHydrated` action called during Zustand's `onRehydrateStorage` callback. This prevents flash-of-wrong-content during initial page load.

### 5. Pagination Over Infinite Scroll
Pagination was chosen for its predictable UX, SEO-friendliness, and simpler implementation. The pagination interface is consistent across all list-based resources.

### 6. CSS Custom Properties Over CSS-in-JS
The theming system uses native CSS custom properties rather than a CSS-in-JS solution. This provides zero-runtime-cost theming, works with Server Components, and is framework-agnostic.

### 7. Direct Cloudinary Uploads
Rather than proxying uploads through the server (which would consume server bandwidth and memory), files are uploaded directly from the browser to Cloudinary using signed requests. The server only handles signature generation.

### 8. PostgreSQL Native Arrays for Tags
Tags are stored as PostgreSQL native string arrays (`String[]` in Prisma) rather than in a separate join table. This simplifies queries while still allowing array operations.

### 9. Profile as Singleton
The profile model is designed as a singleton—there's only one row representing the portfolio owner. This matches the real-world use case (one person, one portfolio) and simplifies the API.

### 10. Soft Visibility Toggles
Rather than deleting content, `published` (projects/posts) and `approved` (testimonials) booleans control visibility. This preserves data and enables draft/preview workflows.

---

## Development Workflow

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Cloudinary account (for image uploads)

### Environment Variables
```
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### Setup
```bash
# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

### Key Commands
```bash
npx prisma studio     # Visual database browser
npx prisma db push    # Sync schema to database
npx prisma generate   # Regenerate Prisma client
```

---

## Deployment Considerations

### Database
- Use a managed PostgreSQL service (Supabase, Neon, Railway, Render)
- Enable connection pooling for serverless environments
- Set up automated backups

### File Storage
- Cloudinary handles all image storage, optimization, and CDN delivery
- Configure Cloudinary environment variables in deployment platform

### Authentication
- Use a strong, randomly generated `JWT_SECRET`
- Consider rotating secrets periodically
- Implement rate limiting on the login endpoint in production

### Performance
- Next.js ISR (Incremental Static Regeneration) for public pages
- Image optimization via Cloudinary transformations
- Lazy loading for below-the-fold images
- Pagination limits prevent large data payloads

### Security
- All admin endpoints require valid JWT
- Cloudinary signatures are generated server-side (API secret never exposed)
- Input validation on all API routes (server-side)
- CORS configured for expected origins only

---

## Summary

Prime-Folio is a production-grade portfolio platform that bridges the gap between static portfolio sites and full content management systems. Its architecture emphasizes:

- **Type safety** end-to-end (TypeScript + Prisma + Zustand)
- **Performance** (server-side rendering, optimized image delivery, granular state subscriptions)
- **Developer experience** (clean store patterns, consistent APIs, comprehensive TypeScript types)
- **User experience** (dark/light themes, real-time upload progress, responsive design)
- **Maintainability** (separation of concerns, consistent patterns, well-documented code)

Whether deployed as a personal portfolio or extended as a client project, Prime-Folio provides a solid, scalable foundation for any professional online presence.