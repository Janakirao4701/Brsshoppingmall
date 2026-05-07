<!-- BEGIN:nextjs-agent-rules -->

# Next.js Version Awareness

This project uses a modern Next.js App Router architecture.

Before implementing or modifying:
- routing
- middleware
- caching
- metadata
- server components
- client boundaries
- route handlers
- image handling
- authentication
- streaming
- deployment behavior

verify patterns against:
node_modules/next/dist/docs/
or the installed Next.js version documentation.

Do not assume older Next.js APIs or Pages Router behavior.

Prefer:
- Server Components by default
- minimal client-side rendering
- stable App Router patterns
- modern Next.js conventions compatible with the installed version

Avoid:
- deprecated APIs
- outdated routing patterns
- unnecessary "use client"
- legacy Pages Router assumptions

# Git & Operational Safety

Strict adherence to version control hygiene is required:
- **Inspect `git status`** before every commit/push.
- **Review staged files** to ensure only relevant changes are included.
- **Verify `.gitignore`** coverage to prevent accidental leaks of build files or logs.
- **Selective Staging**: Prefer `git add [file]` over `git add .` to avoid accidental commits of scratch files or secrets.
- **No `git commit -a`**: Never commit all changes automatically; review the diff first.
- **Secret Prevention**: Double-check for hardcoded keys or `.env` exposure before staging.

# Completion & Verification

Before marking a task as complete:
1. **Run `npm run build`**: Ensure the production build succeeds without errors.
2. **Verify TypeScript**: Fix all type errors in changed files.
3. **No Hydration Mismatches**: Check for potential "use client" vs server component conflicts.
4. **Console Audit**: Ensure no runtime errors or console warnings are introduced.

For trivial styling or isolated UI adjustments, avoid unnecessary documentation loading.

<!-- END:nextjs-agent-rules -->