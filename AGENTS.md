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

# Infrastructure Awareness & Debugging

The BSR Shopping Mall project primarily uses Vercel-hosted environment variables for production and preview deployments.

### Operational Rules:
- **Do NOT repeatedly assume missing local .env files** are the root cause of runtime failures.
- Before diagnosing missing environment variables, determine whether the application is intended to run against:
  - Local development environment
  - Vercel preview deployment
  - Vercel production deployment

### Deployed Environment Diagnostics:
If the issue occurs only in deployed environments, prioritize:
- Vercel Environment Variable configuration (Settings > Environment Variables)
- Vercel project environment scopes (Production vs. Preview)
- Runtime environment differences (Edge vs. Node.js)
- Server/Client environment exposure rules (ensure `NEXT_PUBLIC_` prefix for client-side keys)

### Secret Management:
- Avoid repeatedly searching for or requesting local secrets when they are managed in Vercel.
- **NEVER recommend exposing service-role keys** to client-side code (`use client`).
- When local environment variables are required for development, explicitly state which ones are missing and whether they exist in Vercel.

### Supabase Integration & Failure Logic:
For Supabase-related failures, verify the following in order before assuming missing keys:
1. **Runtime Connectivity**: Check network logs and server-side console outputs.
2. **Auth/Session Flow**: Verify middleware cookie handling and session persistence.
3. **Role Permissions**: Check RLS policies for the `authenticated` or `anon` roles.
4. **SSR/Client Boundaries**: Ensure Server Components are not trying to access client-only auth states.
5. **Deployment Logs**: Inspect Vercel Runtime Logs for specific error messages.

Prefer diagnostic reasoning over repetitive environment-variable assumptions.

# Completion & Verification

Before marking a task as complete:
1. **Run `npm run build`**: Ensure the production build succeeds without errors.
2. **Verify TypeScript**: Fix all type errors in changed files.
3. **No Hydration Mismatches**: Check for potential "use client" vs server component conflicts.
4. **Console Audit**: Ensure no runtime errors or console warnings are introduced.

For trivial styling or isolated UI adjustments, avoid unnecessary documentation loading.

<!-- END:nextjs-agent-rules -->