# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **GAR Mill Procurement Intelligence** application - a React-based dashboard for managing and evaluating palm oil mill procurement. The app provides intelligence on mill assessments, risk analysis, and procurement workflows for sustainable sourcing.

## Development Commands

### Setup and Development
```bash
npm install                 # Install dependencies
npm run dev                # Start development server (port 3000)
npm run build              # Build for production
npm run preview            # Preview production build
```

### Environment Configuration
Create `.env.local` in project root:
```
GEMINI_API_KEY=your_api_key_here
```

## Architecture

### Single-File Component Pattern
- **App.tsx**: Contains the entire application logic (~2000+ lines)
- **index.tsx**: React application entry point
- Uses React hooks (useState, useMemo) for state management
- No external state management library (Redux, Zustand)
- No routing - single page application

### Data Structure
The application uses static demo data with these core types:
- **Mill**: Palm oil mill information with risk assessment fields
- **Facility**: Processing facility data with regional mapping
- **Transaction**: Buyer and transaction data
- **MillFacilityDistance**: Geographic relationships

### Technology Stack
- **React 19.2.0** with TypeScript
- **Vite 6.2.0** for build system and dev server
- **Lucide React** for icons (extensive usage - 40+ icons imported)
- **Tailwind CSS** for styling (utility-first approach)
- **Gemini AI API** integration for intelligent features

## Code Conventions

### TypeScript Configuration
- Target: ES2022 with ESNext modules
- Path aliases: `@/*` maps to project root
- JSX: react-jsx transform
- Experimental decorators enabled

### Naming Patterns
- **Files**: PascalCase for components, camelCase for utilities
- **Interfaces**: PascalCase (Mill, Facility, Transaction)
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE for demo data

### Import Style
- Extensive individual Lucide icon imports at file top
- React hooks imported from 'react'
- Local imports using relative paths

## Development Workflow

### Git Configuration
This project is configured with:
- **User**: Rian Faredisto
- **Email**: rian.faredisto@gmail.com
- **Repository**: https://github.com/obelsixs/MMDP-REPO.git
- **Branch**: main

Git credentials are configured globally and will persist across Claude Code sessions.

### Quality Checks (Manual - No Automated Tools)
Since no linting, testing, or formatting tools are configured:

1. **Build Verification**: Run `npm run build` to check for TypeScript errors
2. **Manual Testing**: Test in browser via `npm run dev`
3. **Type Safety**: Ensure proper TypeScript interface usage
4. **API Integration**: Verify Gemini API key is properly set

### Before Committing
- Verify production build succeeds
- Test interactive features manually
- Ensure responsive design works across screen sizes
- Validate data filtering and search functionality

### Commit Message Convention
Follow conventional commits format:
```
feat: Brief description

- Detailed change 1
- Detailed change 2

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

## Key Features to Understand

- **Dashboard Interface**: Tabbed layout with Mill List, Facilities, Analytics
- **Interactive Tables**: Sortable, filterable data grids
- **Modal System**: Detailed views and multi-step workflows
- **Search & Filtering**: Real-time data processing
- **Risk Assessment**: Color-coded risk levels (Low/Medium/High)
- **Upload Wizards**: Multi-step data import processes
- **Workflow Management**: Asana integration patterns

## Scalability Notes

- Single-file component approach may need refactoring for team development
- Consider adding automated testing, linting, and formatting tools
- No authentication/authorization system implemented
- Static demo data - may need backend integration for production use