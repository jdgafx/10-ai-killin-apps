# Deployment Environment Configuration

## GitHub Secrets Setup Guide

This document lists all required GitHub Secrets that must be configured in your GitHub repository for the CI/CD deployment workflow to function correctly.

### Overview

The CI/CD pipeline automatically injects these secrets as environment variables during the build process. These variables are critical for integrating with various AI provider APIs and ensuring proper authentication.

---

## Required GitHub Secrets

### 1. **VITE_MINIMAX_API_KEY**

**Purpose:** Authentication token for MiniMax API  
**Service:** MiniMax (Chinese AI provider)  
**Scope:** Text generation, Code generation, Image understanding  
**Environment Variable Name:** `VITE_MINIMAX_API_KEY`  

**How to obtain:**
1. Visit https://www.minimaxi.com/
2. Create a MiniMax account
3. Navigate to API Dashboard → API Keys
4. Generate a new API key
5. Copy the key (keep it secure and never commit to version control)

**Format:** String, typically 60-80 characters  
**Example:** `eyJhbGc...` (actual key should be much longer)

---

### 2. **VITE_DEEPSEEK_API_KEY**

**Purpose:** Authentication token for DeepSeek API  
**Service:** DeepSeek (Advanced reasoning AI model)  
**Scope:** Code analysis, Complex reasoning, Mathematical problems  
**Environment Variable Name:** `VITE_DEEPSEEK_API_KEY`  

**How to obtain:**
1. Visit https://platform.deepseek.com/
2. Create a DeepSeek account
3. Navigate to API Keys section
4. Generate a new API key
5. Copy and securely store the key

**Format:** String (API key format)  
**Example:** `sk-xxx...` (typically starts with sk-)

---

### 3. **VITE_GITHUB_COPILOT_TOKEN**

**Purpose:** GitHub Copilot CLI authentication token  
**Service:** GitHub Copilot  
**Scope:** Code completion, Intelligent suggestions, Repository analysis  
**Environment Variable Name:** `VITE_GITHUB_COPILOT_TOKEN`  

**How to obtain:**
1. Ensure you have an active GitHub Copilot subscription
2. Visit https://github.com/settings/copilot
3. Use GitHub CLI: `gh auth token` or generate Personal Access Token with Copilot scope
4. Go to https://github.com/settings/tokens
5. Create new token with `copilot` scope
6. Copy the token immediately (it won't be shown again)

**Format:** Personal Access Token (PAT), typically 40+ characters  
**Example:** `ghp_xxxxxxxxxxxxxxxxxxxx...`

---

### 4. **VITE_GEMINI_CLIENT_ID**

**Purpose:** Google Gemini API Client ID  
**Service:** Google Gemini (Multimodal AI)  
**Scope:** Text generation, Image understanding, Embeddings  
**Environment Variable Name:** `VITE_GEMINI_CLIENT_ID`  

**How to obtain:**
1. Visit https://ai.google.dev/
2. Create a Google account (if needed)
3. Click "Get API Key" or go to https://makersuite.google.com/app/apikey
4. Create a new API key
5. Copy the key

**Format:** String, typically alphanumeric with hyphens  
**Example:** `AIzaSyDxxx...` (actual key should be longer)

---

## Setting Up Secrets in GitHub

### Method 1: GitHub Web Interface (Recommended)

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** (top right)
5. For each secret below:
   - **Name:** Enter the exact secret name (e.g., `VITE_MINIMAX_API_KEY`)
   - **Secret:** Paste the API key value
   - Click **Add secret**

### Method 2: GitHub CLI

```bash
# Ensure you're authenticated with GitHub CLI
gh auth login

# Set each secret
gh secret set VITE_MINIMAX_API_KEY --body "your-minimax-key-here"
gh secret set VITE_DEEPSEEK_API_KEY --body "your-deepseek-key-here"
gh secret set VITE_GITHUB_COPILOT_TOKEN --body "your-copilot-token-here"
gh secret set VITE_GEMINI_CLIENT_ID --body "your-gemini-key-here"
```

---

## Checklist

Before deploying, ensure:

- [ ] **VITE_MINIMAX_API_KEY** - Obtained from MiniMax dashboard
- [ ] **VITE_DEEPSEEK_API_KEY** - Obtained from DeepSeek platform
- [ ] **VITE_GITHUB_COPILOT_TOKEN** - Generated GitHub token with Copilot scope
- [ ] **VITE_GEMINI_CLIENT_ID** - Obtained from Google AI Studio
- [ ] All secrets added to GitHub repository settings
- [ ] Workflow file (`.github/workflows/deploy-all.yml`) is configured
- [ ] All 10 projects have `vite.config.js` configured
- [ ] Node.js version is compatible (18+)
- [ ] Build command exits with code 0 for all projects

---

## Verifying Secrets Are Accessible

The CI/CD workflow logs will indicate if secrets are missing:

```
❌ VITE_MINIMAX_API_KEY is not set
```

If you see this error:
1. Return to GitHub Settings → Secrets
2. Verify the secret name matches exactly (case-sensitive)
3. Ensure it's added to the correct repository (not organization-level by mistake)
4. Re-run the workflow

---

## Security Best Practices

⚠️ **CRITICAL SECURITY NOTES:**

1. **Never commit API keys to version control** - Use GitHub Secrets only
2. **Rotate keys periodically** - Every 3-6 months
3. **Limit key scope** - Only enable required permissions for each key
4. **Monitor usage** - Check API provider dashboards for unexpected activity
5. **Use environment-specific keys** - Consider separate keys for staging/production
6. **Revoke immediately if compromised** - Regenerate the key in provider dashboard

### If a Secret is Accidentally Committed:

1. **Immediately revoke** the key in the provider's dashboard
2. **Update** the GitHub Secret with a new key
3. **Force-push** a new commit (if in a private repo) or use `git filter-branch`
4. Consider rotating all API keys as a precaution

---

## Troubleshooting

### Build Fails with "API Key is undefined"

**Cause:** Secret not properly set in GitHub  
**Solution:**
1. Verify secret name is exact (case-sensitive)
2. Ensure you're editing the right repository
3. Try re-running the workflow after adding the secret

### "Unauthorized" or "Invalid API Key" Error

**Cause:** Incorrect or expired key  
**Solution:**
1. Test the API key locally with a simple curl request
2. Verify it's the most recent key (not a revoked one)
3. Check API provider dashboard for rate limits or account issues

### Environmental Variables Not Available in Build

**Cause:** Variables not properly prefixed with `VITE_`  
**Solution:**
- All secrets used by Vite must start with `VITE_` prefix
- This is a Vite security feature to prevent leaking secrets
- Any other prefix won't be included in the build

---

## Monitoring & Maintenance

### Regular Checks:

- Monitor GitHub Actions tab for failed workflows
- Check API provider dashboards for unusual activity
- Review build logs for warnings about missing keys
- Update API keys before expiration (if applicable)

### Update Process:

1. Generate new API key in provider dashboard
2. Update the GitHub Secret with the new value
3. Delete the old API key from provider
4. Run the workflow to verify everything works

---

## Support & Resources

- **MiniMax Documentation:** https://www.minimaxi.com/document
- **DeepSeek Documentation:** https://platform.deepseek.com/docs
- **GitHub Copilot Guide:** https://github.com/features/copilot
- **Google Gemini API:** https://ai.google.dev/tutorials
- **GitHub Secrets Guide:** https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions

---

**Last Updated:** 2024  
**Version:** 1.0  
**Status:** Active
