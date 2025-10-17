# DGUI Python Build Makefile
# Integrates code generation with Python build process

.PHONY: generate build install dev test clean

# Generate Python code from JSON Schema
generate:
	@echo "🔧 Generating Python code from JSON Schema..."
	../scripts/generate-python.sh

# Build the Python package
build: generate
	@echo "📦 Building Python package..."
	python -m build

# Install the package in development mode
install: generate
	@echo "📥 Installing package in development mode..."
	pip install -e .

# Install development dependencies
dev-deps:
	@echo "📦 Installing development dependencies..."
	pip install -e ".[dev]"

# Run tests
test:
	@echo "🧪 Running tests..."
	pytest

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf build/
	rm -rf dist/
	rm -rf *.egg-info/
	rm -rf __pycache__/
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

# Watch mode for development (requires entr or similar)
watch:
	@echo "👀 Watching for schema changes..."
	@if command -v entr >/dev/null 2>&1; then \
		find ../schema -name "*.json" | entr -c make generate; \
	else \
		echo "❌ 'entr' not found. Install it for watch mode: brew install entr (macOS) or apt-get install entr (Ubuntu)"; \
		exit 1; \
	fi

# Full development setup
setup: dev-deps generate
	@echo "✅ Development setup complete!"

# Help
help:
	@echo "Available targets:"
	@echo "  generate   - Generate Python code from JSON Schema"
	@echo "  build      - Build the Python package"
	@echo "  install    - Install package in development mode"
	@echo "  dev-deps   - Install development dependencies"
	@echo "  test       - Run tests"
	@echo "  clean      - Clean build artifacts"
	@echo "  watch      - Watch for schema changes and regenerate"
	@echo "  setup      - Full development setup"
	@echo "  help       - Show this help message"
