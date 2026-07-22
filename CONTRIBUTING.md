# Contributing to GMG Delegate Portal

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Be respectful, inclusive, and professional. We're building a welcoming community.

## Getting Started

### Prerequisites
- Node.js 16+
- Git
- Supabase account
- GitHub account

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/gmg-delegate-portal.git
   cd gmg-delegate-portal
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/JaySaner/GMG_PDF.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Setup Supabase**
   - Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   - Create `.env.local` with your credentials

6. **Start development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Creating a Feature Branch

```bash
# Update main branch
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Making Changes

1. **Make your changes** in descriptive commits
   ```bash
   git add .
   git commit -m "Add feature description"
   ```

2. **Keep commits clean**
   - One logical change per commit
   - Use clear commit messages
   - Reference issues: `Fixes #123`

3. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

### Creating a Pull Request

1. Go to the original repository
2. Click "New Pull Request"
3. Select your feature branch
4. Fill in the PR template:
   - **Title**: Brief description (50 chars max)
   - **Description**: What changes and why
   - **Related Issues**: Link any related issues
   - **Testing**: How to test the changes

### Commit Message Format

```
Type: Short description (max 50 chars)

Detailed explanation of changes (wrap at 72 chars)
- Bullet point 1
- Bullet point 2

Fixes #123
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (formatting)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Build process, dependencies

## Code Standards

### TypeScript
- Use strict type checking
- Avoid `any` types
- Document complex types

### React Components
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic to custom hooks

### File Organization
```
src/
├── components/     # React components
├── hooks/         # Custom hooks
├── lib/           # Utilities and configs
├── types.ts       # Type definitions
└── styles/        # CSS files
```

### Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Functions/Variables**: camelCase (e.g., `getUserData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- **Folders**: kebab-case (e.g., `user-profile`)

## Testing

```bash
# Run type checking
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Documentation

- Update README.md if changing features
- Add JSDoc comments to complex functions
- Include examples in documentation
- Keep docs up-to-date with code changes

## Reporting Issues

### Before Creating an Issue
1. Search existing issues
2. Check the documentation
3. Verify it's reproducible

### Issue Template
```
**Description**
Clear description of the issue

**Steps to Reproduce**
1. Step 1
2. Step 2

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: 
- Node version:
- Browser:
```

## Pull Request Review Process

1. **Automated Checks**
   - TypeScript compilation
   - Code style (linting)
   - Build success

2. **Code Review**
   - Maintainers review your changes
   - Suggestions may be made
   - Discuss any questions

3. **Approval**
   - At least one approval required
   - Pass all checks
   - Squash and merge to main

## Branching Strategy

- **main**: Production-ready code
- **feature/***: New features
- **fix/***: Bug fixes
- **docs/***: Documentation updates

## Performance Tips

- Use React DevTools Profiler for components
- Check bundle size with `npm run build`
- Optimize images before committing
- Lazy load components when possible

## Security

- Never commit secrets or credentials
- Use environment variables for sensitive data
- Report security issues privately to maintainers
- Keep dependencies up-to-date

## Getting Help

- **Documentation**: Check README.md and SUPABASE_SETUP.md
- **GitHub Issues**: Search or create an issue
- **Discussions**: Use GitHub Discussions for questions
- **Discord/Slack**: (if applicable)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub insights

## License

By contributing, you agree to license your work under the same license as the project (Apache-2.0).

---

Thank you for contributing! Your efforts help make GMG Delegate Portal better. 🙌
