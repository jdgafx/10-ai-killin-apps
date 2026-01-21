#!/bin/bash

###############################################################################
# Vercel Deployment Setup Script for 10 AI Projects
# 
# This script automates:
# 1. Creation of vercel.json for each project
# 2. Setting environment variables via Vercel CLI
# 3. Deploying all projects to Vercel
#
# Usage: 
#   ./scripts/setup-vercel.sh [command]
#
# Commands:
#   config  - Generate vercel.json files for all projects
#   secrets - Set environment variables (requires manual input)
#   deploy  - Deploy all projects to production
#   preview - Deploy all projects to preview
#   all     - Run config, secrets, and deploy
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APPS_DIR="$REPO_ROOT/apps"
CONFIG_DIR="$REPO_ROOT/config/vercel"
TEMPLATE_FILE="$CONFIG_DIR/vercel-template.json"

# Array of all 10 AI projects
declare -a PROJECTS=(
  "app-01-ai-code-reviewer"
  "app-02-document-chat"
  "app-03-image-generator"
  "app-04-voice-assistant"
  "app-05-code-explainer"
  "app-06-test-generator"
  "app-07-api-integrator"
  "app-08-data-visualizer"
  "app-09-autonomous-agent"
  "app-10-rag-knowledge-base"
)

# Project display names for Vercel
declare -A PROJECT_NAMES=(
  ["app-01-ai-code-reviewer"]="ai-code-reviewer"
  ["app-02-document-chat"]="document-chat"
  ["app-03-image-generator"]="image-generator"
  ["app-04-voice-assistant"]="voice-assistant"
  ["app-05-code-explainer"]="code-explainer"
  ["app-06-test-generator"]="test-generator"
  ["app-07-api-integrator"]="api-integrator"
  ["app-08-data-visualizer"]="data-visualizer"
  ["app-09-autonomous-agent"]="autonomous-agent"
  ["app-10-rag-knowledge-base"]="rag-knowledge-base"
)

###############################################################################
# Helper Functions
###############################################################################

print_header() {
  echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}  $1${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
  echo -e "${BLUE}ℹ $1${NC}"
}

check_vercel_cli() {
  if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI not found. Installing..."
    npm install -g vercel
    print_success "Vercel CLI installed successfully"
  else
    print_success "Vercel CLI found: $(vercel --version)"
  fi
}

check_vercel_auth() {
  if ! vercel whoami &> /dev/null; then
    print_warning "Not authenticated with Vercel"
    print_info "Please run: vercel login"
    print_info "Or set VERCEL_TOKEN environment variable"
    exit 1
  else
    print_success "Authenticated as: $(vercel whoami)"
  fi
}

###############################################################################
# Main Functions
###############################################################################

generate_vercel_configs() {
  print_header "Generating vercel.json for all projects"
  
  if [ ! -f "$TEMPLATE_FILE" ]; then
    print_error "Template file not found: $TEMPLATE_FILE"
    exit 1
  fi
  
  for project in "${PROJECTS[@]}"; do
    local app_dir="$APPS_DIR/$project"
    local vercel_config="$app_dir/vercel.json"
    
    if [ ! -d "$app_dir" ]; then
      print_warning "Project directory not found: $app_dir (skipping)"
      continue
    fi
    
    # Copy template
    cp "$TEMPLATE_FILE" "$vercel_config"
    
    print_success "Created vercel.json for $project"
  done
  
  print_success "All vercel.json files generated successfully"
}

setup_vercel_secrets() {
  print_header "Setting up Vercel environment variables"
  
  print_info "Environment variables need to be set for each project"
  print_info "You can set them globally or per-project"
  print_info ""
  print_info "Required variables:"
  echo "  - VITE_MINIMAX_API_KEY"
  echo "  - VITE_DEEPSEEK_API_KEY"
  echo "  - VITE_GITHUB_COPILOT_TOKEN"
  echo "  - VITE_GEMINI_CLIENT_ID (optional)"
  print_info ""
  
  read -p "Do you want to set secrets now? (y/n): " -n 1 -r
  echo
  
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Skipping secret setup"
    print_info "You can set secrets later with: vercel env add <KEY>"
    return
  fi
  
  print_info "Reading secrets from environment or prompting..."
  
  # MiniMax API Key
  if [ -z "$VITE_MINIMAX_API_KEY" ]; then
    read -p "Enter VITE_MINIMAX_API_KEY: " VITE_MINIMAX_API_KEY
  fi
  
  # DeepSeek API Key
  if [ -z "$VITE_DEEPSEEK_API_KEY" ]; then
    read -p "Enter VITE_DEEPSEEK_API_KEY: " VITE_DEEPSEEK_API_KEY
  fi
  
  # GitHub Copilot Token
  if [ -z "$VITE_GITHUB_COPILOT_TOKEN" ]; then
    read -p "Enter VITE_GITHUB_COPILOT_TOKEN: " VITE_GITHUB_COPILOT_TOKEN
  fi
  
  # Gemini Client ID (optional)
  if [ -z "$VITE_GEMINI_CLIENT_ID" ]; then
    read -p "Enter VITE_GEMINI_CLIENT_ID (optional, press Enter to skip): " VITE_GEMINI_CLIENT_ID
  fi
  
  print_info ""
  print_info "Setting secrets for all projects..."
  
  for project in "${PROJECTS[@]}"; do
    local app_dir="$APPS_DIR/$project"
    local project_name="${PROJECT_NAMES[$project]}"
    
    if [ ! -d "$app_dir" ]; then
      continue
    fi
    
    cd "$app_dir"
    
    print_info "Setting secrets for $project..."
    
    # Set secrets (pipe to avoid interactive prompts)
    echo "$VITE_MINIMAX_API_KEY" | vercel env add VITE_MINIMAX_API_KEY production --force 2>/dev/null || true
    echo "$VITE_DEEPSEEK_API_KEY" | vercel env add VITE_DEEPSEEK_API_KEY production --force 2>/dev/null || true
    echo "$VITE_GITHUB_COPILOT_TOKEN" | vercel env add VITE_GITHUB_COPILOT_TOKEN production --force 2>/dev/null || true
    
    if [ -n "$VITE_GEMINI_CLIENT_ID" ]; then
      echo "$VITE_GEMINI_CLIENT_ID" | vercel env add VITE_GEMINI_CLIENT_ID production --force 2>/dev/null || true
    fi
    
    print_success "Secrets set for $project"
    
    cd "$REPO_ROOT"
  done
  
  print_success "All secrets configured"
}

deploy_projects() {
  local env_flag="$1"
  local env_name="${2:-production}"
  
  print_header "Deploying all projects to Vercel ($env_name)"
  
  local success_count=0
  local fail_count=0
  declare -a failed_projects
  
  for project in "${PROJECTS[@]}"; do
    local app_dir="$APPS_DIR/$project"
    local project_name="${PROJECT_NAMES[$project]}"
    
    if [ ! -d "$app_dir" ]; then
      print_warning "Project directory not found: $app_dir (skipping)"
      ((fail_count++))
      failed_projects+=("$project")
      continue
    fi
    
    cd "$app_dir"
    
    print_info "Deploying $project..."
    
    # Deploy with appropriate flag
    if vercel $env_flag --yes 2>&1 | tee /tmp/vercel-deploy-$project.log; then
      print_success "$project deployed successfully"
      ((success_count++))
      
      # Extract and display URL
      local url=$(grep -oP 'https://[a-zA-Z0-9\-\.]+\.vercel\.app' /tmp/vercel-deploy-$project.log | tail -1)
      if [ -n "$url" ]; then
        print_info "  URL: $url"
      fi
    else
      print_error "$project deployment failed"
      ((fail_count++))
      failed_projects+=("$project")
    fi
    
    cd "$REPO_ROOT"
    echo ""
  done
  
  # Summary
  print_header "Deployment Summary"
  print_success "Successful: $success_count/${#PROJECTS[@]}"
  
  if [ $fail_count -gt 0 ]; then
    print_error "Failed: $fail_count/${#PROJECTS[@]}"
    print_info "Failed projects:"
    for failed in "${failed_projects[@]}"; do
      echo "  - $failed"
    done
  fi
}

deploy_production() {
  deploy_projects "--prod" "production"
}

deploy_preview() {
  deploy_projects "" "preview"
}

link_projects() {
  print_header "Linking projects to Vercel"
  
  for project in "${PROJECTS[@]}"; do
    local app_dir="$APPS_DIR/$project"
    local project_name="${PROJECT_NAMES[$project]}"
    
    if [ ! -d "$app_dir" ]; then
      print_warning "Project directory not found: $app_dir (skipping)"
      continue
    fi
    
    cd "$app_dir"
    
    print_info "Linking $project..."
    
    if [ -f ".vercel/project.json" ]; then
      print_warning "$project already linked (skipping)"
    else
      vercel link --yes || print_error "Failed to link $project"
      print_success "$project linked"
    fi
    
    cd "$REPO_ROOT"
  done
  
  print_success "All projects linked"
}

show_usage() {
  cat << EOF
Vercel Deployment Setup Script

Usage: $0 [command]

Commands:
  config   Generate vercel.json files for all projects
  secrets  Set environment variables (requires manual input)
  link     Link projects to Vercel (interactive)
  deploy   Deploy all projects to production
  preview  Deploy all projects to preview
  all      Run config, link, and deploy
  help     Show this help message

Environment Variables:
  VERCEL_TOKEN               Vercel authentication token
  VITE_MINIMAX_API_KEY      MiniMax API key
  VITE_DEEPSEEK_API_KEY     DeepSeek API key
  VITE_GITHUB_COPILOT_TOKEN GitHub Copilot token
  VITE_GEMINI_CLIENT_ID     Google Gemini OAuth client ID

Examples:
  # Generate configs only
  $0 config
  
  # Deploy to preview
  $0 preview
  
  # Full setup and deployment
  $0 all
  
  # Set environment variables
  export VERCEL_TOKEN=your_token
  $0 deploy

For more information, see: docs/VERCEL_DEPLOYMENT.md

EOF
}

###############################################################################
# Main Script Logic
###############################################################################

main() {
  local command="${1:-help}"
  
  case "$command" in
    config)
      check_vercel_cli
      generate_vercel_configs
      ;;
    secrets)
      check_vercel_cli
      check_vercel_auth
      setup_vercel_secrets
      ;;
    link)
      check_vercel_cli
      check_vercel_auth
      link_projects
      ;;
    deploy)
      check_vercel_cli
      check_vercel_auth
      deploy_production
      ;;
    preview)
      check_vercel_cli
      check_vercel_auth
      deploy_preview
      ;;
    all)
      check_vercel_cli
      check_vercel_auth
      generate_vercel_configs
      link_projects
      setup_vercel_secrets
      deploy_production
      ;;
    help|--help|-h)
      show_usage
      ;;
    *)
      print_error "Unknown command: $command"
      echo ""
      show_usage
      exit 1
      ;;
  esac
}

# Run main function
main "$@"
