# SEO Management Documentation

## Overview
The SEO Management section provides comprehensive tools to manage your blog's search engine optimization settings, tags, categories, and meta information.

## Access
Navigate to `/admin/seo` or click the **SEO Management** card from the admin dashboard.

## Features

### 1. Tags Management
**Purpose**: View and analyze all tags used across your blog posts.

**Features**:
- View all unique tags with usage count
- See tag statistics (total tags, most used, average usage)
- Tags are automatically extracted from blog posts
- Visual display with post counts

**Statistics Displayed**:
- **Total Tags**: Number of unique tags across all posts
- **Most Used**: Highest number of times a single tag is used
- **Avg per Tag**: Average number of posts per tag

### 2. Categories Management
**Purpose**: Organize content into categories for better navigation and SEO.

**Features**:
- Add new categories with name, slug, image, and description
- Live image preview when adding categories
- Edit existing categories
- Delete categories
- Auto-generate SEO-friendly slugs from category names
- Visual category cards with images in the listing

**Category Fields**:
- **Name**: Display name (e.g., "AI & Machine Learning")
- **Slug**: URL-friendly identifier (e.g., "ai-ml")
- **Image URL**: Category header/thumbnail image (600x400px recommended)
- **Description**: Brief explanation for SEO and navigation

**Default Categories**:
1. AI & Machine Learning - Articles about AI and ML
2. Technology - Tech trends and innovations
3. Enterprise - Enterprise solutions
4. Research - Research and discoveries

### 3. Meta Settings
**Purpose**: Configure site-wide SEO settings and default meta tags.

**Settings**:

#### Site Name
Your blog's official name used in meta tags and social sharing.
- Default: "The Daily Chronicle"

#### Site Description
Default meta description for SEO (150-160 characters recommended).
- Used when individual posts don't have custom descriptions
- Appears in search results and social shares

#### Site URL
Your blog's canonical URL.
- Format: `https://yourdomain.com`
- Used for generating absolute URLs for social sharing

#### Default OG Image
Fallback Open Graph image for social media sharing.
- Recommended size: 1200x630px
- Used when posts don't have custom images

#### Twitter Handle
Your Twitter/X username for Twitter Card meta tags.
- Format: `@yourusername`
- Enables proper attribution in social shares

**Preview Feature**:
See how your site will appear in search results with the current settings.

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   └── seo/
│   │       └── page.tsx          # SEO Management UI
│   └── api/
│       └── seo/
│           └── route.ts           # SEO API endpoints
└── lib/
    └── seo.ts                     # SEO data and types
```

## Usage Examples

### Adding a Category
1. Navigate to SEO Management → Categories tab
2. Fill in the category name (slug auto-generates)
3. Add a description
4. Click "Add Category"

### Viewing Tag Statistics
1. Navigate to SEO Management → Tags tab
2. View all tags with their usage counts
3. Check statistics at the bottom for insights

### Updating Meta Settings
1. Navigate to SEO Management → Meta Settings tab
2. Update any field
3. Preview changes in the preview section
4. Click "Save SEO Settings"

## Best Practices

### Tags
- Use consistent capitalization
- Keep tags focused and specific
- Aim for 3-5 tags per post
- Review tag statistics regularly to identify popular topics

### Categories
- Keep category names clear and descriptive
- Use 4-8 main categories
- Ensure categories don't overlap significantly
- Update descriptions to reflect current content

### Meta Settings
- Keep site description under 160 characters
- Use high-quality OG images (1200x630px)
- Include your primary keywords in the description
- Update settings when rebranding or changing focus

## API Endpoints

### GET /api/seo
Retrieve current SEO settings.

**Response**:
```json
{
  "siteName": "The Daily Chronicle",
  "siteDescription": "...",
  "siteUrl": "https://...",
  "defaultOgImage": "https://...",
  "twitterHandle": "@...",
  "keywords": [...],
  "categories": [...]
}
```

### PUT /api/seo
Update SEO settings (requires authentication).

**Headers**:
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body**:
```json
{
  "siteName": "New Name",
  "siteDescription": "New description",
  ...
}
```

## Future Enhancements

Planned features:
- [ ] Keyword research integration
- [ ] SEO score calculator
- [ ] Sitemap generator
- [ ] Robots.txt editor
- [ ] Meta tag validation
- [ ] Category-based post filtering
- [ ] Tag merging/renaming tools
- [ ] Bulk tag operations
- [ ] Analytics integration
- [ ] Schema.org markup generator

## Technical Notes

- Tags are extracted dynamically from posts
- Categories support future implementation for post filtering
- Settings are currently stored in TypeScript files
- Future versions will use database storage
- All changes require admin authentication
