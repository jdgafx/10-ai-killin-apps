#!/bin/bash
set -e

# ============================================
# Docker Deployment Script for AI Portfolio
# ============================================
# This script builds and deploys all 10 applications
# Usage: ./scripts/docker-deploy.sh [OPTIONS]
# Options:
#   --build-only    Build images without deploying
#   --deploy-only   Deploy without building
#   --push          Push images to registry
#   --single APP    Build/deploy single app (e.g., app-01)
#   --registry URL  Specify Docker registry URL
# ============================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REGISTRY_URL="${DOCKER_REGISTRY_URL:-}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCKER_COMPOSE_FILE="$PROJECT_ROOT/docker-compose.yml"
ENV_FILE="$PROJECT_ROOT/.env"

# Application list
APPS=(
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

# Default options
BUILD_IMAGES=true
DEPLOY_CONTAINERS=true
PUSH_IMAGES=false
SINGLE_APP=""

# ============================================
# Helper Functions
# ============================================

print_header() {
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}"
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

check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    print_success "Docker found: $(docker --version)"
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    print_success "Docker Compose found"
    
    # Check .env file
    if [ ! -f "$ENV_FILE" ]; then
        print_warning ".env file not found at $ENV_FILE"
        print_info "Creating template .env file..."
        create_env_template
    else
        print_success ".env file found"
    fi
    
    # Check Docker daemon
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running"
        exit 1
    fi
    print_success "Docker daemon is running"
    
    echo ""
}

create_env_template() {
    cat > "$ENV_FILE" << 'EOF'
# AI Provider API Keys
VITE_MINIMAX_API_KEY=your_minimax_api_key_here
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
VITE_GEMINI_CLIENT_ID=your_gemini_client_id_here

# Feature Flags
VITE_ENABLE_RAG=true
VITE_ENABLE_VOICE=true
VITE_DEFAULT_PROVIDER=minimax

# Docker Registry (optional)
DOCKER_REGISTRY_URL=
EOF
    print_success "Created .env template at $ENV_FILE"
    print_warning "Please update the .env file with your actual API keys"
}

build_image() {
    local app_name=$1
    print_info "Building image for $app_name..."
    
    if docker-compose -f "$DOCKER_COMPOSE_FILE" build "$app_name"; then
        print_success "Built image for $app_name"
        return 0
    else
        print_error "Failed to build image for $app_name"
        return 1
    fi
}

tag_image() {
    local app_name=$1
    local registry=$2
    
    if [ -n "$registry" ]; then
        print_info "Tagging image for $app_name..."
        local source_tag="ai-portfolio/$app_name:latest"
        local target_tag="$registry/$app_name:latest"
        
        if docker tag "$source_tag" "$target_tag"; then
            print_success "Tagged $target_tag"
            return 0
        else
            print_error "Failed to tag $target_tag"
            return 1
        fi
    fi
}

push_image() {
    local app_name=$1
    local registry=$2
    
    if [ -n "$registry" ]; then
        print_info "Pushing image for $app_name..."
        local target_tag="$registry/$app_name:latest"
        
        if docker push "$target_tag"; then
            print_success "Pushed $target_tag"
            return 0
        else
            print_error "Failed to push $target_tag"
            return 1
        fi
    fi
}

# ============================================
# Main Functions
# ============================================

build_all_images() {
    print_header "Building Docker Images"
    
    local failed_builds=()
    
    if [ -n "$SINGLE_APP" ]; then
        if build_image "$SINGLE_APP"; then
            if [ "$PUSH_IMAGES" = true ]; then
                tag_image "$SINGLE_APP" "$REGISTRY_URL"
                push_image "$SINGLE_APP" "$REGISTRY_URL"
            fi
        else
            failed_builds+=("$SINGLE_APP")
        fi
    else
        for app in "${APPS[@]}"; do
            if build_image "$app"; then
                if [ "$PUSH_IMAGES" = true ]; then
                    tag_image "$app" "$REGISTRY_URL"
                    push_image "$app" "$REGISTRY_URL"
                fi
            else
                failed_builds+=("$app")
            fi
        done
    fi
    
    echo ""
    if [ ${#failed_builds[@]} -eq 0 ]; then
        print_success "All images built successfully"
    else
        print_error "Failed to build ${#failed_builds[@]} images:"
        for app in "${failed_builds[@]}"; do
            echo "  - $app"
        done
        exit 1
    fi
}

deploy_containers() {
    print_header "Deploying Containers"
    
    if [ -n "$SINGLE_APP" ]; then
        print_info "Deploying $SINGLE_APP..."
        if docker-compose -f "$DOCKER_COMPOSE_FILE" up -d "$SINGLE_APP"; then
            print_success "Deployed $SINGLE_APP"
        else
            print_error "Failed to deploy $SINGLE_APP"
            exit 1
        fi
    else
        print_info "Deploying all applications..."
        if docker-compose -f "$DOCKER_COMPOSE_FILE" up -d; then
            print_success "All applications deployed"
        else
            print_error "Failed to deploy applications"
            exit 1
        fi
    fi
    
    echo ""
}

show_status() {
    print_header "Container Status"
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
    echo ""
}

show_logs() {
    print_header "Recent Logs"
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
    echo ""
}

show_summary() {
    print_header "Deployment Summary"
    
    echo -e "${GREEN}Applications are accessible at:${NC}"
    echo ""
    
    local ports=(8001 8002 8003 8004 8005 8006 8007 8008 8009 8010)
    local app_names=(
        "AI Code Reviewer"
        "Document Chat"
        "Image Generator"
        "Voice Assistant"
        "Code Explainer"
        "Test Generator"
        "API Integrator"
        "Data Visualizer"
        "Autonomous Agent"
        "RAG Knowledge Base"
    )
    
    for i in "${!ports[@]}"; do
        echo -e "  ${BLUE}App $(($i + 1)):${NC} ${app_names[$i]}"
        echo -e "    ${GREEN}http://localhost:${ports[$i]}${NC}"
        echo ""
    done
    
    echo -e "${YELLOW}Useful commands:${NC}"
    echo -e "  View logs:     ${BLUE}docker-compose logs -f [service]${NC}"
    echo -e "  Stop all:      ${BLUE}docker-compose down${NC}"
    echo -e "  Restart:       ${BLUE}docker-compose restart [service]${NC}"
    echo -e "  View status:   ${BLUE}docker-compose ps${NC}"
    echo ""
}

# ============================================
# Parse Arguments
# ============================================

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --build-only)
                BUILD_IMAGES=true
                DEPLOY_CONTAINERS=false
                shift
                ;;
            --deploy-only)
                BUILD_IMAGES=false
                DEPLOY_CONTAINERS=true
                shift
                ;;
            --push)
                PUSH_IMAGES=true
                shift
                ;;
            --single)
                SINGLE_APP="$2"
                shift 2
                ;;
            --registry)
                REGISTRY_URL="$2"
                shift 2
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --build-only     Build images without deploying"
                echo "  --deploy-only    Deploy without building"
                echo "  --push           Push images to registry"
                echo "  --single APP     Build/deploy single app"
                echo "  --registry URL   Specify Docker registry URL"
                echo "  --help           Show this help message"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done
}

# ============================================
# Main Execution
# ============================================

main() {
    parse_arguments "$@"
    
    clear
    print_header "AI Portfolio Docker Deployment"
    echo ""
    
    check_prerequisites
    
    if [ "$BUILD_IMAGES" = true ]; then
        build_all_images
    fi
    
    if [ "$DEPLOY_CONTAINERS" = true ]; then
        deploy_containers
        sleep 5  # Wait for containers to start
        show_status
    fi
    
    show_summary
    
    print_success "Deployment complete!"
}

# Run main function
main "$@"
