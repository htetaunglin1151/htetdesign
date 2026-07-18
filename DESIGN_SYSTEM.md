# HtetDesign Design System

## Goal
Make the portfolio consistent, responsive, and easy to update.

## Rules
- Use design tokens before creating new CSS values.
- Do not hardcode random colors, font sizes, spacing, or radius.
- Do not use inline styles.
- Keep `styles.css` as the global source of truth.
- Use `about.css` only for About-page-specific styles.

## Colors
Use semantic color tokens:
- Background #000000
- Surface #1D2124
- Text Primary #FFFFFF
- Text Secondary #B2B2B2
- Tech Green #34DA30
- Divider #1D2124 (`--color-divider`, matches Surface — never white)
- Surface Light #FFFFFF (`--color-surface-light`) — light backdrop for artwork that needs it (e.g. white-background GIFs)
- Scrim rgba(0, 0, 0, 0.55) (`--color-scrim`) — translucent backdrop for controls overlaid on media (e.g. video buttons)
- Ticket Cream #F2E9DC (`--color-ticket-cream`) — About concert ticket card face
- Ticket Ink #000000 (`--color-ticket-ink`, aliases Background) — About concert ticket text and borders
- Ticket Stain #7A5C3E (`--color-ticket-stain`) — sepia aging tint on the ticket's paper texture

## Typography
Use:
- H1: hero headline only
font-family: "Familjen Grotesk";
font-size: 40px;
font-style: normal;
font-weight: 500;
line-height: 45px; /* 112.5% */

- H2: section title
font-family: "Familjen Grotesk";
font-size: 32px;
font-style: normal;
font-weight: 500;
line-height: 35px; /* 109.375% */

- H3: card title
font-family: Inter;
font-size: 24px;
font-style: normal;
font-weight: 600;
line-height: normal;

- Body: paragraph text
font-family: Inter;
font-size: 18px;
font-style: normal;
font-weight: 400;
line-height: normal;

- Supporting Text
font-family: Inter;
font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: normal;


- Caption: metadata, labels, dates
font-family: Inter;
font-size: 12px;
font-style: normal;
font-weight: 400;
line-height: normal;

## Spacing
Use only:
4, 8, 12, 16, 24, 32, 48, 64, 96

## Radius
Use only:
Small = 8
Medium = 12
Large = 16
Pill = 999

## Aspect Ratios
Use only:
Gallery = 4:3 (`--ratio-gallery`) — sandbox photo gallery slides
Ticket = 16:9 (`--ratio-ticket`) — About concert ticket flip card
Video = 4:3 (`--ratio-video`) — About content creation video crop

## AI Instructions
When updating code:
1. First check existing tokens in `styles.css`.
2. If a needed token is missing, add it to `:root`.
3. Replace hardcoded values with tokens.
4. Keep mobile and desktop responsive.
5. Do not redesign the visual style unless asked.