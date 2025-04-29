# 10x Knowtes

A modern note-taking application designed for developers and technical users to organize, create, and generate AI-enhanced summaries of their knowledge.

## Features

- **Topic Organization**: Create and manage hierarchical topics to organize your notes effectively.
- **Rich Note Editor**: Capture your thoughts with a clean, distraction-free editor.
- **AI-Powered Summaries**: Generate concise summaries of your notes to extract key insights.
- **Responsive Design**: Fully responsive UI with a sleek neon-themed interface.
- **Internationalization**: Support for multiple languages with easy language switching.
- **Secure Authentication**: User account management with secure authentication.

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom neon-themed design system
- **Internationalization**: i18next for multi-language support
- **Containerization**: Docker for consistent deployment

## Project Structure

- `./app` - Next.js app directory containing pages and layouts
- `./components` - React components
- `./components/ui` - Shadcn/UI components
- `./hooks` - Custom React hooks
- `./lib` - Utility functions and configuration
- `./middleware` - Next.js middleware
- `./public` - Static assets
- `./styles` - Global CSS styles
- `./translations` - Internationalization files

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/10x-knowtes.git
   cd 10x-knowtes
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Add environment variables to the `.env.local` file:

    ```bash
    NEXT_PUBLIC_API_URL=http://localhost:3001
    ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Guidelines

### Coding Standards

- Use TypeScript for type safety
- Follow React best practices with functional components and hooks
- Style using Tailwind CSS utility classes
- Implement proper error handling and edge cases

### Accessibility

- Use ARIA landmarks for improved screen reader navigation
- Ensure proper color contrast ratios for neon theme elements
- Implement keyboard navigation support
- Test with accessibility tools

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
