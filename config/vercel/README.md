# Vercel Configuration

This directory contains the Vercel deployment template used by all 10 AI projects.

## Files

- **vercel-template.json** - Base configuration template for all projects

## Configuration Features

✅ **Framework**: Vite  
✅ **Build Command**: `npm run build`  
✅ **Output Directory**: `dist`  
✅ **Node.js Version**: 18+  
✅ **Hot Reload**: Enabled via `vercel dev`  
✅ **Preview Deployments**: Automatic on PR  
✅ **SPA Routing**: All routes fallback to `index.html`  
✅ **Asset Caching**: Static assets cached for 1 year  
✅ **Security Headers**: CSP, XSS, Frame protection enabled  
✅ **Environment Variables**: Referenced via `@` secrets (not hardcoded)

## Usage

### Automated (Recommended)

```bash
# Generate vercel.json for all projects
./scripts/setup-vercel.sh config
```

### Manual

```bash
# Copy template to specific project
cp config/vercel/vercel-template.json apps/app-01-ai-code-reviewer/vercel.json
```

## Environment Variables

All environment variables use Vercel secrets with `@` prefix:

```json
"env": {
  "VITE_MINIMAX_API_KEY": "@minimax_api_key",
  "VITE_DEEPSEEK_API_KEY": "@deepseek_api_key",
  "VITE_GITHUB_COPILOT_TOKEN": "@github_copilot_token",
  "VITE_GEMINI_CLIENT_ID": "@gemini_client_id"
}
```

Set secrets via:

```bash
vercel env add VITE_MINIMAX_API_KEY production
```

## Routes Configuration

The template includes:

1. **Asset Caching**: `/assets/*` cached for 1 year
2. **Filesystem Handling**: Direct serving of static files
3. **SPA Fallback**: All other routes → `index.html`

## Security Headers

Default headers included:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## Customization

To customize for specific projects:

1. Copy template to project directory
2. Edit `vercel.json` as needed
3. Add project-specific configurations

Example project-specific settings:

```json
{
  "functions": {
    "api/**/*.js": {
      "maxDuration": 10
    }
  },
  "crons": [
    {
      "path": "/api/cleanup",
      "schedule": "0 0 * * *"
    }
  ]
}
```

## Documentation

For complete deployment guide, see:
📖 [docs/VERCEL_DEPLOYMENT.md](../../docs/VERCEL_DEPLOYMENT.md)

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Vite Docs**: https://vitejs.dev/
- **Script Help**: `./scripts/setup-vercel.sh help`
