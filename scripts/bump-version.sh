#!/bin/bash

# Version bumping script for DGUI packages
# Usage: ./scripts/bump-version.sh <version>
# Example: ./scripts/bump-version.sh 1.2.3

set -e

# Check if version argument is provided
if [ $# -eq 0 ]; then
    echo "Error: Version argument is required"
    echo "Usage: $0 <version>"
    echo "Example: $0 1.2.3"
    exit 1
fi

VERSION=$1

# Validate version format (semantic versioning)
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Invalid version format. Expected semantic version (e.g., 1.2.3)"
    exit 1
fi

echo "Bumping version to $VERSION..."

# Update Python package version
echo "Updating python/pyproject.toml..."
sed -i.bak "s/^version = \".*\"/version = \"$VERSION\"/" python/pyproject.toml
rm python/pyproject.toml.bak

# Update JavaScript package versions
JS_PACKAGES=(
    "js/packages/core/package.json"
    "js/packages/schemas/package.json"
    "js/packages/adapters/package.json"
    "js/packages/material-ui/package.json"
    "js/packages/ant-design/package.json"
    "js/packages/chakra-ui/package.json"
)

for package in "${JS_PACKAGES[@]}"; do
    echo "Updating $package..."
    # Update the main version field
    sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" "$package"
    rm "$package.bak"
done

# Update internal dependencies in adapter packages
echo "Updating internal dependencies..."

# Update @dgui/core references in adapter packages
ADAPTER_PACKAGES=(
    "js/packages/adapters/package.json"
    "js/packages/material-ui/package.json"
    "js/packages/ant-design/package.json"
    "js/packages/chakra-ui/package.json"
)

for package in "${ADAPTER_PACKAGES[@]}"; do
    echo "Updating @dgui/core dependency in $package..."
    sed -i.bak "s/\"@dgui\/core\": \"[^\"]*\"/\"@dgui\/core\": \"$VERSION\"/" "$package"
    rm "$package.bak"
done

# Update @dgui/schemas and @dgui/adapters references in core package
echo "Updating dependencies in js/packages/core/package.json..."
sed -i.bak "s/\"@dgui\/schemas\": \"[^\"]*\"/\"@dgui\/schemas\": \"$VERSION\"/" "js/packages/core/package.json"
sed -i.bak "s/\"@dgui\/adapters\": \"[^\"]*\"/\"@dgui\/adapters\": \"$VERSION\"/" "js/packages/core/package.json"
rm js/packages/core/package.json.bak

echo "Version bump completed successfully!"
echo "All packages now use version $VERSION"
