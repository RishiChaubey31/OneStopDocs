# PRD Creator

A powerful Product Requirements Document (PRD) editor built with Next.js and TipTap.

## Features

### Rich Text Editing
- **Text Formatting**: Bold, italic, underline, strikethrough, and highlight
- **Headings**: Multiple heading levels (Title, H1, H2, H3)
- **Text Alignment**: Left, center, and right alignment
- **Font Customization**: Font family and size selection
- **Color Options**: Text color and background color
- **Links**: Insert and edit links with a user-friendly dialog
  - Click the link button or use `Ctrl+K` (or `Cmd+K` on Mac) to insert/edit links
  - Support for HTTP, HTTPS, mailto, and tel protocols
  - Automatic URL validation
  - Edit existing links by clicking on them and using the link button

### Media Support
- **Images**: Drag and drop images or use the image button
- **Resizable Images**: Click and drag the resize handle to resize images

### User Experience
- **Keyboard Shortcuts**: 
  - `Ctrl+B` / `Cmd+B`: Bold
  - `Ctrl+I` / `Cmd+I`: Italic
  - `Ctrl+U` / `Cmd+U`: Underline
  - `Ctrl+Z` / `Cmd+Z`: Undo
  - `Ctrl+Y` / `Cmd+Y`: Redo
  - `Ctrl+K` / `Cmd+K`: Insert/edit link
  - `Ctrl+Shift+L`: Align left
  - `Ctrl+Shift+E`: Align center
  - `Ctrl+Shift+R`: Align right
  - `Ctrl+1-4` / `Cmd+1-4`: Heading levels 1-4
- **Drag and Drop**: Drop images directly onto the editor
- **Real-time Preview**: See your changes as you type
- **Tooltips**: Hover over toolbar buttons to see functionality and shortcuts

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
