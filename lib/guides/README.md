# Guides Content Management

This directory contains the content for the Rêve guides section.

## Adding a New Guide

To add a new guide, edit `lib/guides/content.ts`:

### 1. Add guide metadata to the `guides` array:

```typescript
{
  slug: 'your-guide-slug',
  title: 'Guide Title',
  description: 'Brief description for cards and SEO',
  readTime: '5 min read',
  publishedAt: '2024-01-15',
  content: [
    // sections here
  ]
}
```

### 2. Add content sections:

```typescript
content: [
  {
    heading: 'Section Title',
    content: `Your content here.

Use **bold** for emphasis by wrapping text in double asterisks.

Multiple paragraphs are separated by blank lines.

You can use markdown-style formatting:
- Lists (not yet styled but content preserved)
- Links (rendered as-is)
- Code blocks (preserved as text)`
  },
  // more sections...
]
```

### 3. Update landing page icons (optional):

If you want a custom icon for your guide card on the landing page, edit:
- `components/landing/guides-section.tsx` - Add guide to the `guides` array with appropriate icon
- `components/guides/guides-index.tsx` - Update `iconMap` and `colorMap`

### 4. Build and test:

```bash
npm run build
```

Your guide will be automatically:
- Generated as a static page at `/guides/your-guide-slug`
- Added to the guides index at `/guides`
- Displayed on the landing page guides section

## Content Guidelines

**Tone**: Informative, encouraging, science-backed
**Length**: 4-8 sections per guide
**Formatting**:
- Use `**text**` for bold/emphasis
- Keep paragraphs concise (2-4 sentences)
- Include research references when applicable
- Start each guide with "What is..." or "Why..." context

## File Structure

```
lib/guides/
├── content.ts          # All guide content (single source of truth)
└── README.md           # This file

app/guides/
├── page.tsx            # Guides index page (/guides)
└── [slug]/page.tsx     # Dynamic guide pages (/guides/[slug])

components/guides/
├── guides-index.tsx    # Guides index component
└── guide-article.tsx   # Individual guide article component

components/landing/
└── guides-section.tsx  # Landing page guides section
```

## No CMS Needed (For Now)

This simple TypeScript-based approach works well for:
- Small number of guides (3-20)
- Infrequent updates
- Developer-managed content
- Type-safe content structure

**Future CMS considerations**: If you need non-technical editors or 50+ guides, consider:
- Contentful
- Sanity.io
- Notion API
- MDX files with frontmatter
