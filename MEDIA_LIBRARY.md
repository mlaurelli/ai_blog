# Media Library & Image Management

The CMS now includes a comprehensive media library system with image upload, management, and AI-powered image search capabilities.

## Features

### 1. **Image Upload**
- Upload images directly from your computer
- Support for JPG, PNG, WebP, and **animated GIFs**
- Maximum file size: 10MB
- Files stored in `/public/uploads` directory
- Automatic filename sanitization and timestamping

### 2. **Media Library**
- View all uploaded images in a grid layout
- Copy image URLs to clipboard with one click
- File metadata display (filename, size, upload date)
- GIF files are clearly marked
- Access via: `/admin/media` or Dashboard → Media Library button

### 3. **AI-Powered Image Search**
- Automatically finds relevant images based on your post title and excerpt
- Uses Unsplash API for high-quality, free-to-use images
- Intelligent keyword extraction from post content
- Custom search query override available
- 12 image results per search

### 4. **Image Picker Component**
The enhanced image picker in post creation/editing includes 4 tabs:

#### **URL Tab**
- Manually enter any image URL
- Quick paste from external sources

#### **Upload Tab**
- Drag-and-drop or click to upload
- Instant preview after upload
- Automatically adds to media library

#### **Library Tab**
- Browse all your uploaded images
- Click any image to select it
- Visual grid layout

#### **🤖 Find Image Tab**
- AI analyzes your post title and excerpt
- Suggests relevant images automatically
- Click "Search" to find images
- Optional custom search query

## Setup

### Basic Setup (No API Key Required)
The system works out of the box with demo images. When using the AI search without an Unsplash API key, you'll get a curated selection of technology/AI-themed images.

### Full Setup (Recommended)
For full AI image search capabilities:

1. Get a free Unsplash API key:
   - Visit: https://unsplash.com/developers
   - Create an account and register your application
   - Copy your "Access Key"

2. Add to `.env.local`:
   ```
   UNSPLASH_ACCESS_KEY=your_access_key_here
   ```

3. Restart your development server

## Usage in CMS

### When Creating a Post:

1. Fill in title and excerpt
2. Scroll to "Cover Image" field
3. Choose your preferred method:
   - **Upload**: Click "Browse" → "Upload" tab → select file
   - **AI Search**: Click "Browse" → "🤖 Find Image" tab → "Search"
   - **Library**: Click "Browse" → "Library" tab → select from uploads
   - **URL**: Enter any image URL directly

### When Editing a Post:

Same workflow as creating - the image picker retains full functionality in edit mode.

## API Endpoints

### Upload Image
- **Endpoint**: `POST /api/media/upload`
- **Body**: FormData with 'file' field
- **Returns**: `{ success: true, url: string, filename: string, size: number, type: string }`

### List Media
- **Endpoint**: `GET /api/media/list`
- **Returns**: `{ success: true, files: MediaFile[] }`

### Search Images
- **Endpoint**: `POST /api/media/search`
- **Body**: `{ query?: string, title?: string, excerpt?: string }`
- **Returns**: `{ success: true, query: string, images: SearchImage[] }`

## File Structure

```
src/
├── app/
│   └── api/
│       └── media/
│           ├── upload/route.ts    # File upload handler
│           ├── list/route.ts      # Media library listing
│           └── search/route.ts    # AI image search
├── components/
│   └── ImagePicker.tsx            # Enhanced image picker component
└── app/admin/
    └── media/page.tsx             # Media library page

public/
└── uploads/                       # Uploaded images (gitignored)
```

## Security Notes

- Only authenticated admin users can upload images
- File type validation prevents non-image uploads
- File size limit prevents abuse
- Sanitized filenames prevent directory traversal
- Uploaded files are stored in public directory for web access

## Tips

1. **GIF Support**: Animated GIFs are fully supported and will animate in blog posts
2. **Optimization**: For production, consider adding image optimization (e.g., sharp, next/image)
3. **CDN**: For better performance, consider uploading to a CDN instead of local storage
4. **Backup**: The `/public/uploads` directory should be backed up separately

## Troubleshooting

### Upload fails
- Check file size (must be under 10MB)
- Verify file type (JPG, PNG, GIF, WebP only)
- Ensure write permissions on `/public/uploads` directory

### AI search returns demo images
- Verify `UNSPLASH_ACCESS_KEY` is set in `.env.local`
- Restart your development server after adding the key
- Check Unsplash API rate limits (50 requests/hour for free tier)

### Images not displaying
- Check that uploaded files are in `/public/uploads`
- Verify URL starts with `/uploads/` (not `/public/uploads`)
- Check browser console for 404 errors
