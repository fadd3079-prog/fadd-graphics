# FADD GRAPHICS — PRD

## Overview

FADD GRAPHICS is a graphic design portfolio website for showcasing design work and converting visitors into clients.

The current project must be rebuilt completely. This is not a partial refactor. Treat the current codebase as legacy. The structure is messy, the UI is weak, the visual hierarchy is poor, the dark style is too heavy, and the project does not yet represent a premium graphic design brand.

The new product must feel modern, elegant, clean, responsive, smooth, premium, and maintainable.

## Important Project Context

All current assets such as:
- logo
- portfolio images
- design previews
- supporting graphics

are located in:

`/home/fadhol/projects/fadd-graphics/assets`

The rebuild must account for this.

You may reorganize the assets into a cleaner structure, but do not randomly discard useful files. Review, sort, rename cleanly, and use them properly in the new system.

## Rebuild Directive

Rebuild the entire frontend from zero-quality standards using a modern Vite stack.

You are allowed to:
- replace most or all existing code
- delete bad or outdated files
- rename files and folders
- redesign the UI completely
- restructure the project architecture
- rewrite weak copy
- reorganize the asset library
- create a much cleaner and more scalable codebase

Do not preserve weak legacy decisions just because they already exist.

## Product Goals

The rebuilt website must:
- present FADD GRAPHICS as a credible professional design brand
- showcase portfolio work in a curated and premium way
- feel visually strong on both desktop and mobile
- improve readability and reduce eye strain
- support polished light mode and dark mode
- use modern frontend architecture
- use clean reusable components
- be smooth, responsive, and production-ready

## Tech Stack

Required:
- Vite
- React
- TypeScript
- Tailwind CSS

Optional only if truly useful:
- lucide-react
- framer-motion
- clsx
- react-hook-form
- zod

## Code Standards

The codebase must be:
- clean
- modular
- scalable
- readable
- reusable
- consistent

Rules:
- no code comments
- no dead code
- no giant files
- no duplicated component logic
- no broken imports
- no syntax errors
- no placeholder junk
- no weak temporary structure
- no monolithic page dump
- no messy naming

## Product Type

A single high-end portfolio website with strong landing-page quality and clean architecture.

It should be easy to scale later.

## Design Direction

The new design must feel:
- premium
- formal but natural
- clean
- modern
- elegant
- balanced
- refined

Avoid:
- overly dark black-heavy design
- harsh contrast everywhere
- childish or flashy styling
- cluttered sections
- poor spacing
- generic template feel
- inconsistent card styles
- inconsistent border radius
- visually tiring layout
- random gradients
- weak typography

Use:
- strong visual hierarchy
- balanced whitespace
- controlled accent colors
- polished surfaces
- subtle gradients where appropriate
- elegant shadows and borders
- refined hover, focus, and active states
- premium section composition
- comfortable reading contrast

## Theme System

The site must support:
- light mode
- dark mode

Requirements:
- theme toggle in the header
- both themes must feel intentional and polished
- dark mode must not be too black-heavy
- light mode must not feel plain or unfinished
- theme state should be handled properly
- all components must work in both themes

## Brand Tone

The site should communicate:
- professionalism
- creativity
- trust
- premium service quality
- modern design thinking

Writing tone:
- natural formal
- concise
- polished
- not robotic
- not exaggerated
- not awkward

Use one language consistently across the site and improve all weak copy.

## Asset Handling Requirements

All assets currently live under the existing `assets` directory.

You must:
- audit the assets directory
- reorganize it into a clean scalable structure
- keep naming consistent
- separate content types properly
- avoid duplicate or confusing file placement
- use portfolio assets intentionally, not randomly

Recommended structure:

- `src/assets/branding`
- `src/assets/portfolio`
- `src/assets/images`
- `src/assets/icons`

If a better structure is more appropriate, use it.

Also:
- normalize filenames
- prefer clean kebab-case names
- group portfolio works meaningfully
- remove obvious unused duplicates only when safe
- keep the asset system maintainable

## Core Pages / Sections

The site should include these sections:

1. Header
2. Hero
3. Brand intro
4. Featured works
5. Portfolio gallery
6. Services
7. Process
8. Why choose FADD GRAPHICS
9. About / Founder
10. Trust / Testimonials
11. FAQ
12. Contact
13. Footer

## Required Features

### Header
- sticky behavior
- desktop navigation
- mobile navigation
- theme toggle
- polished CTA
- refined scroll behavior

### Hero
- strong headline
- supportive subheadline
- clear CTA
- premium composition
- visually balanced layout

### Featured Works
- curated showcase
- strong first impression
- not overcrowded

### Portfolio Gallery
- responsive grid
- category filters
- project tags
- project metadata
- hover states
- preview modal or detail interaction
- consistent thumbnail treatment
- premium spacing and alignment

### Services
Include a professional services section suitable for a graphic design studio.

Possible service categories:
- logo design
- poster and social media design
- banner design
- branding materials
- apparel / merchandise design
- certificate / print design
- custom design requests

### Process
Display a clean process flow such as:
- consultation
- brief
- concept
- revision
- final delivery

### Why Choose FADD GRAPHICS
Explain quality, style, collaboration, communication, and design value.

### About / Founder
Present the founder or studio identity in a stronger and more credible way.

### Trust / Testimonials
Add a trust-building section. If real testimonials are not available, create a clean placeholder structure that is easy to replace later.

### FAQ
Add a useful FAQ section relevant to design clients.

### Contact
- inquiry form
- input validation
- accessible fields
- clear response states
- professional CTA
- contact links for email / WhatsApp / social platforms where appropriate

### Utility Features
- back to top button
- smooth scrolling
- polished interactive states
- graceful empty states if needed

## Responsive Requirements

The site must work beautifully on:
- small mobile
- normal mobile
- tablet
- laptop
- desktop
- large desktop

Requirements:
- mobile-first implementation
- no broken grids
- no overlapping content
- no cramped spacing
- no tiny unreadable text
- no desktop-only thinking
- no section that feels like a shrunk desktop layout

The mobile experience must feel intentionally designed.

## Animation Requirements

Motion should be:
- smooth
- subtle
- premium
- restrained

Use animation only where it improves quality.

Avoid:
- noisy motion
- excessive parallax
- gimmicky transitions
- over-animated UI

## Accessibility Requirements

Must include:
- semantic HTML structure
- proper headings
- keyboard-friendly navigation
- visible focus states
- accessible buttons and forms
- good contrast
- reduced-motion respect where relevant

## Performance Requirements

The rebuild must aim for:
- fast loading
- reasonable bundle size
- smooth interaction
- minimal unnecessary dependencies
- good asset usage
- clean rendering behavior

## SEO / Metadata

Set up:
- strong page title
- good meta description
- proper favicon handling if available
- solid basic metadata for a portfolio website

## Suggested App Architecture

Create a clean structure such as:

- `src/app`
- `src/components`
- `src/sections`
- `src/layouts`
- `src/data`
- `src/assets`
- `src/hooks`
- `src/lib`
- `src/styles`

You may improve this structure if a better architecture is more appropriate.

## Data Strategy

Portfolio items, services, FAQs, testimonials, and other repeated content should be driven from structured data files where appropriate instead of hardcoded scattered markup.

Use a clean content-driven approach.

## Content Quality Requirements

Rewrite weak content so the site sounds more professional and premium.

Content should feel:
- clear
- concise
- persuasive
- confident
- natural

Avoid:
- filler text that looks cheap
- awkward English or awkward Indonesian
- exaggerated marketing tone
- generic student portfolio wording

## Execution Plan

1. Audit the current project
2. Audit the assets directory
3. Decide what should be removed, migrated, renamed, or rebuilt
4. Create the new Vite + React + TypeScript + Tailwind foundation
5. Build a clean design system
6. Reorganize assets into a maintainable structure
7. Rebuild all main sections
8. Add theme support
9. Improve responsiveness
10. Polish motion and interactions
11. Validate forms and UI states
12. Clean the final codebase
13. Run checks and fix issues

## Final Acceptance Criteria

The rebuild is complete only if:
- the project uses Vite
- the codebase is clean and modular
- the old messy structure is gone
- the UI feels significantly more premium
- the layout is polished on desktop and mobile
- light mode and dark mode both work properly
- portfolio presentation is much better
- assets are reorganized cleanly
- all core sections are implemented
- there are no broken imports
- there are no obvious syntax errors
- there are no obvious layout bugs
- the project runs successfully

## Deliverables

Expected final output:
- rebuilt Vite frontend
- React + TypeScript + Tailwind architecture
- reorganized asset structure
- premium responsive UI
- light/dark mode
- improved portfolio UX
- clean reusable components
- production-quality frontend foundation