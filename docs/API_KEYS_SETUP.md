# API Keys Setup Guide

> **Secure guide for setting up API keys for MiniMax, Google Gemini, and DeepSeek AI providers.**

---

## Table of Contents

1. [Overview](#overview)
2. [Security Best Practices](#security-best-practices)
3. [MiniMax Setup](#minimax-setup)
4. [Google Gemini OAuth Setup](#google-gemini-oauth-setup)
5. [DeepSeek Configuration](#deepseek-configuration)
6. [Environment Variable Setup](#environment-variable-setup)
7. [API Key Restrictions](#api-key-restrictions)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This portfolio uses three AI providers for resilience and flexibility:

| Provider | Primary Use Cases | Cost | Setup Difficulty |
|----------|------------------|------|------------------|
| **MiniMax** | Chat, Embeddings, Images | Paid (free trial) | Easy |
| **Google Gemini** | Chat, Vision | Free tier available | Medium (OAuth) |
| **DeepSeek** | Code analysis, Reasoning | Paid (free trial) | Easy |

**Multi-Provider Benefits:**
- ✅ Automatic fallback if one provider fails
- ✅ Compare capabilities across providers
- ✅ Cost optimization (use cheapest for each task)
- ✅ Avoid vendor lock-in

---

## Security Best Practices

### 🔒 Critical Security Rules

1. **Never commit API keys to Git**
   ```bash
   # Always use .env.local (already in .gitignore)
   # Never use .env without .local suffix
   ```

2. **Use environment-specific keys**
   - Development: Separate API keys with low rate limits
   - Production: Different API keys with higher limits
   - Never use production keys in development

3. **Rotate keys regularly**
   - Rotate every 90 days minimum
   - Immediately rotate if exposed in logs or screenshots
   - Keep old keys for 24 hours for zero-downtime rotation

4. **Implement rate limiting**
   - Set usage limits on API provider dashboards
   - Implement client-side rate limiting
   - Monitor usage alerts

5. **Restrict API keys**
   - Use domain whitelist restrictions
   - Set IP restrictions if possible
   - Limit API key permissions to only what's needed

6. **Monitor usage**
   - Set up usage alerts (email, Slack)
   - Review usage logs weekly
   - Investigate anomalies immediately

### 🚨 What to Do If Key Is Exposed

1. **Immediately revoke** the exposed key
2. **Generate new key** with restrictions
3. **Update all deployments** with new key
4. **Review usage logs** for unauthorized usage
5. **Report to provider** if abuse detected

---

## MiniMax Setup

MiniMax is the primary AI provider for chat, embeddings, and image generation.

### Step 1: Create MiniMax Account

1. Go to https://api.minimax.chat
2. Click **Sign Up** (or **注册** for Chinese interface)
3. Choose registration method:
   - Email + password
   - Phone number (China)
   - WeChat (China)
4. Verify your account

### Step 2: Add Payment Method (Optional)

1. Navigate to **Billing** (账单)
2. Click **Add Payment Method**
3. Enter credit card details
4. Add initial credits ($10 minimum recommended)

**Pricing (as of 2025):**
- Chat (minimax-abab6.5): $0.015 per 1K tokens
- Embeddings: $0.0001 per 1K tokens
- Image generation: $0.02 per image

### Step 3: Generate API Key

1. Go to **API Keys** section (API密钥)
2. Click **Create New Key**
3. Configure key settings:
   ```
   Name: AI Portfolio - Development
   Rate Limit: 60 requests/minute
   Expiration: 90 days (recommended)
   Permissions: Chat, Embeddings, Image Generation
   ```
4. Click **Generate**
5. **Copy the key immediately** (shown only once)

**API Key Format:**
```
sk-cp-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 4: Set Up Key Restrictions

1. Go to **Key Settings**
2. Add **Domain Whitelist**:
   ```
   localhost:3000
   localhost:8001
   your-domain.com
   *.github.io
   *.vercel.app
   ```
3. Set **Usage Limits**:
   - Daily limit: $5
   - Monthly limit: $100
   - Alert threshold: 80%
4. Enable **Usage Alerts**:
   - Email notifications: ✅
   - Slack webhook: (optional)

### Step 5: Test API Key

```bash
# Test chat endpoint
curl -X POST https://api.minimax.chat/v1/chat/completions \
  -H "Authorization: Bearer sk-cp-YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "minimax-abab6.5",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'

# Expected response: JSON with chat completion
```

---

## Google Gemini OAuth Setup

Google Gemini uses OAuth 2.0 for authentication (more secure than API keys).

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click **Select a project** → **New Project**
3. Enter project details:
   ```
   Project Name: AI Portfolio
   Organization: (your organization or leave empty)
   Location: (your location)
   ```
4. Click **Create**

### Step 2: Enable Gemini API

1. In your project, go to **APIs & Services** → **Library**
2. Search for "Generative Language API"
3. Click on the API
4. Click **Enable**

### Step 3: Create OAuth 2.0 Client ID

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Configure consent screen (if prompted):
   ```
   User Type: External
   App Name: AI Portfolio
   Support Email: your.email@example.com
   Developer Contact: your.email@example.com
   ```
4. Add scopes:
   - `https://www.googleapis.com/auth/generative-language`
5. Click **Save and Continue**

### Step 4: Configure OAuth Client

1. Application Type: **Web application**
2. Name: `AI Portfolio - Web Client`
3. Authorized JavaScript origins:
   ```
   http://localhost:3000
   http://localhost:8001
   https://your-username.github.io
   https://your-app.vercel.app
   ```
4. Authorized redirect URIs:
   ```
   http://localhost:3000/oauth/callback
   https://your-username.github.io/10-ai-killin-apps/oauth/callback
   https://your-app.vercel.app/oauth/callback
   ```
5. Click **Create**

### Step 5: Get Client ID

1. Copy your **Client ID**:
   ```
   xxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
   ```
2. Save the **Client Secret** (keep it secure, not used in frontend)

### Step 6: Implement OAuth Flow (Already Done)

The OAuth flow is already implemented in the codebase:

```typescript
// packages/ai-providers/src/gemini/auth.ts
export async function authenticateGemini(): Promise<string> {
  const clientId = import.meta.env.VITE_GEMINI_CLIENT_ID;
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${redirectUri}&` +
    `response_type=token&` +
    `scope=https://www.googleapis.com/auth/generative-language`;
  
  // Open popup for user authentication
  window.open(authUrl, 'gemini-auth', 'width=600,height=600');
  
  // Handle callback and return access token
  return new Promise((resolve) => {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'gemini-auth-success') {
        resolve(event.data.accessToken);
      }
    });
  });
}
```

### Step 7: Test Gemini Integration

```bash
# Gemini requires OAuth, test via UI
# 1. Start app: npm run dev:app-03
# 2. Click "Connect Gemini"
# 3. Log in with Google account
# 4. Grant permissions
# 5. Test image analysis feature
```

---

## DeepSeek Configuration

DeepSeek provides specialized code models and reasoning capabilities.

### Step 1: Create DeepSeek Account

1. Go to https://platform.deepseek.com
2. Click **Sign Up** (注册)
3. Choose registration method:
   - Email + verification code
   - Phone number
4. Complete verification

### Step 2: Add Credits

1. Go to **Billing** → **Recharge** (充值)
2. Minimum: $10 USD
3. Payment methods:
   - Credit card
   - PayPal
   - Alipay (China)
   - WeChat Pay (China)

**Pricing (as of 2025):**
- DeepSeek Chat: $0.003 per 1K tokens (very cheap!)
- DeepSeek Coder: $0.003 per 1K tokens
- DeepSeek Reasoner: $0.01 per 1K tokens

### Step 3: Generate API Key

1. Go to **API Keys** (API密钥)
2. Click **Create API Key**
3. Configure:
   ```
   Name: AI Portfolio - Dev
   Rate Limit: 60 RPM (requests per minute)
   Models: All (chat, coder, reasoner)
   Expiration: 90 days
   ```
4. Click **Confirm**
5. **Copy the key** (shown only once)

**API Key Format:**
```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 4: Set Usage Limits

1. Go to **Settings** → **Usage Limits**
2. Set limits:
   ```
   Daily Limit: $3
   Monthly Limit: $50
   Alert Email: your.email@example.com
   Alert Threshold: 80%
   ```
3. Enable alerts:
   - Email: ✅
   - SMS: (optional)

### Step 5: Test API Key

```bash
# Test chat endpoint
curl -X POST https://api.deepseek.com/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'

# Test coder endpoint
curl -X POST https://api.deepseek.com/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-coder",
    "messages": [{"role": "user", "content": "Write a function to reverse a string"}]
  }'
```

---

## Environment Variable Setup

### Local Development Setup

#### Step 1: Create .env.local File

```bash
# In project root
cp .env.example .env.local
```

#### Step 2: Add Your API Keys

Edit `.env.local`:

```bash
# ============================================
# AI Provider API Keys (REQUIRED)
# ============================================

# MiniMax API (Primary Provider)
VITE_MINIMAX_API_KEY=sk-cp-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# DeepSeek API (Fallback Provider)
VITE_DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google Gemini OAuth Client ID (Optional)
VITE_GEMINI_CLIENT_ID=xxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com

# ============================================
# Feature Flags
# ============================================

# Enable RAG features (Document Chat, Knowledge Base)
VITE_ENABLE_RAG=true

# Enable voice features (Voice Assistant)
VITE_ENABLE_VOICE=true

# Default AI provider (minimax, deepseek, or gemini)
VITE_DEFAULT_PROVIDER=minimax

# ============================================
# Optional Configuration
# ============================================

# Node environment
NODE_ENV=development

# API Temperature (0.0 - 1.0, higher = more creative)
AI_TEMPERATURE=0.7

# Max tokens for responses
AI_MAX_TOKENS=2048
```

#### Step 3: Verify Setup

```bash
# Check if environment variables are loaded
npm run dev:app-01

# In browser console
console.log(import.meta.env.VITE_MINIMAX_API_KEY?.substring(0, 10))
// Should print: "sk-cp-Avxj..."

# If undefined, restart dev server
```

### Production Setup

#### GitHub Pages (GitHub Secrets)

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add each variable:
   ```
   Name: VITE_MINIMAX_API_KEY
   Value: sk-cp-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. Repeat for all variables

#### Vercel

1. Go to **Project Settings** → **Environment Variables**
2. Add variables for each environment:
   - **Production:** Used for production deployments
   - **Preview:** Used for pull request previews
   - **Development:** Used for local development (optional)

Example:
```
Name: VITE_MINIMAX_API_KEY
Value: sk-cp-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Environments: Production, Preview
```

#### Coolify

1. Go to **Application** → **Environment Variables**
2. Click **Add Variable**
3. Add each variable:
   ```
   Key: VITE_MINIMAX_API_KEY
   Value: sk-cp-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. Redeploy application

#### Docker Compose

1. Create `.env` file in project root:
   ```bash
   cp .env.example .env
   nano .env
   ```
2. Add your API keys
3. Start services:
   ```bash
   docker-compose up -d
   ```

---

## API Key Restrictions

### Best Practices for Each Provider

#### MiniMax Restrictions

```yaml
Domain Whitelist:
  - localhost:*
  - *.github.io
  - *.vercel.app
  - yourdomain.com

Rate Limits:
  - Requests per minute: 60
  - Daily spend limit: $5
  - Monthly spend limit: $100

Permissions:
  - Chat: ✅
  - Embeddings: ✅
  - Image Generation: ✅
  - Fine-tuning: ❌ (not needed)
```

#### Google Gemini Restrictions

```yaml
Authorized Origins:
  - http://localhost:*
  - https://*.github.io
  - https://*.vercel.app
  - https://yourdomain.com

OAuth Scopes:
  - generative-language (read/write)

Usage Limits:
  - Free tier: 15 RPM (requests per minute)
  - Paid tier: 1000 RPM
```

#### DeepSeek Restrictions

```yaml
Rate Limits:
  - Requests per minute: 60
  - Tokens per minute: 100,000
  - Daily spend: $3
  - Monthly spend: $50

IP Whitelist: (optional)
  - Your server IP
  - Your office IP

Model Access:
  - deepseek-chat: ✅
  - deepseek-coder: ✅
  - deepseek-reasoner: ✅
```

---

## Troubleshooting

### Common Issues

#### 1. "API Key Invalid" Error

**Symptoms:**
```
Error: 401 Unauthorized - Invalid API key
```

**Solutions:**
- ✅ Check API key is correct (no extra spaces)
- ✅ Verify key is not expired
- ✅ Ensure key is prefixed correctly (`sk-cp-` for MiniMax, `sk-` for DeepSeek)
- ✅ Restart dev server after adding key
- ✅ Check environment variable name (must start with `VITE_`)

#### 2. "Rate Limit Exceeded" Error

**Symptoms:**
```
Error: 429 Too Many Requests
```

**Solutions:**
- ✅ Wait 60 seconds and retry
- ✅ Implement exponential backoff
- ✅ Reduce request frequency
- ✅ Upgrade to higher tier plan

#### 3. "Domain Not Allowed" Error

**Symptoms:**
```
Error: 403 Forbidden - Domain not in whitelist
```

**Solutions:**
- ✅ Add your domain to API key restrictions
- ✅ Check domain format (include port for localhost)
- ✅ Verify SSL certificate for HTTPS domains
- ✅ Wait 5 minutes for changes to propagate

#### 4. Environment Variables Not Loading

**Symptoms:**
```javascript
import.meta.env.VITE_MINIMAX_API_KEY // undefined
```

**Solutions:**
- ✅ Ensure variable starts with `VITE_`
- ✅ Check `.env.local` exists in project root
- ✅ Restart Vite dev server
- ✅ Clear Vite cache: `rm -rf node_modules/.vite`
- ✅ Check for syntax errors in `.env.local`

#### 5. Gemini OAuth Not Working

**Symptoms:**
```
Error: redirect_uri_mismatch
```

**Solutions:**
- ✅ Add exact redirect URI to Google Cloud Console
- ✅ Include protocol (http:// or https://)
- ✅ Include port number for localhost
- ✅ Match case exactly (case-sensitive)
- ✅ Wait 5 minutes for changes to propagate

### Testing API Keys

**Test Script:**

Create `scripts/test-api-keys.js`:

```javascript
// Test all API keys
import { minimaxChat } from './packages/ai-providers/src/minimax/chat.js';
import { deepseekChat } from './packages/ai-providers/src/deepseek/chat.js';

async function testAPIs() {
  console.log('Testing MiniMax API...');
  try {
    const response1 = await minimaxChat([
      { role: 'user', content: 'Hello!' }
    ]);
    console.log('✅ MiniMax working:', response1.choices[0].message.content);
  } catch (error) {
    console.error('❌ MiniMax failed:', error.message);
  }

  console.log('\nTesting DeepSeek API...');
  try {
    const response2 = await deepseekChat([
      { role: 'user', content: 'Hello!' }
    ]);
    console.log('✅ DeepSeek working:', response2.choices[0].message.content);
  } catch (error) {
    console.error('❌ DeepSeek failed:', error.message);
  }

  console.log('\nGemini requires OAuth - test via UI');
}

testAPIs();
```

Run:
```bash
node scripts/test-api-keys.js
```

---

## Security Checklist

Before deploying:

- [ ] API keys stored in `.env.local` (not committed to Git)
- [ ] GitHub Secrets configured for CI/CD
- [ ] Vercel environment variables set
- [ ] Coolify environment variables configured
- [ ] Domain whitelist configured for each API key
- [ ] Usage limits and alerts set up
- [ ] API keys have expiration dates (90 days recommended)
- [ ] Rate limiting implemented in application code
- [ ] Monitoring and alerting configured
- [ ] Tested API keys in development environment
- [ ] Separate keys for development and production
- [ ] API keys documented in team password manager (1Password, LastPass, etc.)

---

## Cost Optimization Tips

### 1. Use Cheapest Provider for Each Task

```typescript
// Code analysis → DeepSeek Coder ($0.003/1K tokens)
// General chat → MiniMax ($0.015/1K tokens)
// Image generation → MiniMax ($0.02/image)
// Vision tasks → Gemini (free tier)
```

### 2. Implement Caching

```typescript
// Cache responses for repeated queries
const cache = new Map();

async function chatWithCache(message: string) {
  if (cache.has(message)) {
    return cache.get(message);
  }
  
  const response = await minimaxChat([{ role: 'user', content: message }]);
  cache.set(message, response);
  return response;
}
```

### 3. Use Streaming for Long Responses

```typescript
// Streaming reduces perceived latency and allows early termination
const response = await minimaxChat(messages, { stream: true });

for await (const chunk of response) {
  console.log(chunk.choices[0].delta.content);
  // User can stop generation early to save costs
}
```

### 4. Optimize Token Usage

```typescript
// Truncate long contexts
function truncateContext(text: string, maxTokens: number): string {
  const tokens = text.split(' ');
  return tokens.slice(0, maxTokens).join(' ');
}

// Use shorter models for simple tasks
const model = isComplexTask ? 'minimax-abab6.5' : 'minimax-abab6.5s';
```

### 5. Monitor and Alert

```yaml
Usage Alerts:
  - Daily spend > $5: Email alert
  - Monthly spend > $100: Email + SMS
  - Rate limit hit: Slack notification
  - Unusual usage pattern: Immediate investigation
```

---

## Conclusion

You're now ready to use all three AI providers securely:

✅ **MiniMax** - Primary provider for chat, embeddings, images  
✅ **Google Gemini** - Secondary provider with vision capabilities  
✅ **DeepSeek** - Fallback provider for code analysis  

**Next Steps:**
1. Set up API keys following this guide
2. Configure environment variables
3. Test each provider
4. Deploy with confidence

For additional help:
- MiniMax docs: https://api.minimax.chat/docs
- Gemini docs: https://ai.google.dev/docs
- DeepSeek docs: https://platform.deepseek.com/docs

**Security Reminder:** Rotate your API keys every 90 days! 🔒
