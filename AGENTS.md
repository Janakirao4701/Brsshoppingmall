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

For trivial styling or isolated UI adjustments, avoid unnecessary documentation loading.

<!-- END:nextjs-agent-rules -->