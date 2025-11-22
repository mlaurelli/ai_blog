# The Daily Chronicle

A minimal, elegant newspaper-style blog built with Next.js, TypeScript, and Tailwind CSS. Inspired by classic print journalism with modern web technology.

## Features

- **Classic Newspaper Design**: Traditional masthead, column layouts, and serif typography
- **Responsive Layout**: Works beautifully on mobile, tablet, and desktop
- **Typography**: Uses Playfair Display and Lora fonts for an authentic newspaper feel
- **Multi-column Articles**: Blog posts display in newspaper-style columns on larger screens
- **Dropcap Effect**: First letter of articles styled like classic newspapers
- **Demo Content**: Three sample blog posts included
- **Static Generation**: Fast performance with Next.js static site generation

## Design Elements

- Bold black borders and dividers
- Classic serif typefaces (Playfair Display for headings, Lora for body)
- Justified text alignment for article content
- Volume and edition numbers
- Date stamps and bylines
- Multi-column grid layout
- Dropcap initial letters

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the newspaper.

## Project Structure

```
src/
├── app/
│   ├── blog/[slug]/     # Individual blog post pages
│   ├── about/           # About page
│   ├── layout.tsx       # Root layout with fonts
│   ├── page.tsx         # Home page (front page)
│   └── globals.css      # Global styles
├── components/
│   ├── Layout.tsx       # Main layout with masthead
│   └── PostCard.tsx     # Blog post preview card
└── lib/
    └── posts.ts         # Demo blog post data
```

## Adding New Posts

To add a new blog post, edit `src/lib/posts.ts` and add a new entry to the `posts` array:

```typescript
{
  slug: 'your-post-slug',
  title: 'Your Post Title',
  excerpt: 'A brief description of your post',
  content: `Your full article content with markdown-like formatting...`,
  date: '2025-11-21',
  author: {
    name: 'Author Name',
    avatar: '/avatar.jpg'
  },
  coverImage: '/blog/cover.jpg',
  tags: ['Tag1', 'Tag2']
}
```

## Customization

### Change the Newspaper Name

Edit `src/components/Layout.tsx` and update the masthead title:

```typescript
<h1 className="text-6xl font-bold tracking-tight text-gray-900 mb-2">
  Your Newspaper Name
</h1>
```

### Modify Colors

The design uses a minimal black and white palette. To adjust colors, edit `src/app/globals.css` and Tailwind classes in components.

### Adjust Typography

Fonts are configured in `src/app/layout.tsx`. You can swap Playfair Display and Lora for other Google Fonts.

## Technologies Used

- **Next.js 16** - React framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Playfair Display & Lora** - Google Fonts for classic typography

## CMS (Content Management System)

The blog includes a built-in CMS for creating and managing posts.

### Setup CMS

1. Edit `.env.local` and set your admin password and JWT secret:

```bash
ADMIN_PASSWORD=your_secure_password_here
JWT_SECRET=your_jwt_secret_here_change_this_to_a_random_string
```

2. Access the CMS at: `http://localhost:3000/admin/login`

3. Log in with your password

### CMS Features

- **Secure Login**: Password-protected admin area with JWT authentication
- **Dashboard**: View all posts in a clean table layout
- **Create Posts**: Add new blog posts with a user-friendly form
- **Edit Posts**: Modify existing posts
- **Delete Posts**: Remove posts with confirmation
- **Auto-slug Generation**: Automatically generates URL-friendly slugs from titles

### CMS Routes

- `/admin/login` - Admin login page
- `/admin/dashboard` - Main dashboard with post list
- `/admin/posts/new` - Create new post
- `/admin/posts/edit/[slug]` - Edit existing post

## Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com/new):

```bash
npm install -g vercel
vercel
```

**Important**: When deploying, make sure to add your environment variables (`ADMIN_PASSWORD` and `JWT_SECRET`) in the Vercel dashboard.

## License

MIT
