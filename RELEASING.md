# Release Process

This document describes how to create releases for the DGUI project. The project uses automated semantic versioning with synchronized versions across Python (PyPI) and JavaScript (npm) packages.

## Overview

- **Trigger**: Releases are triggered by creating and pushing git tags
- **Versioning**: Semantic versioning (MAJOR.MINOR.PATCH)
- **Synchronization**: All packages (Python + 6 JavaScript packages) use the same version number
- **Automation**: GitHub Actions automatically bumps versions and publishes to PyPI and npm

## Release Steps

### 1. Determine the Next Version

Follow semantic versioning rules:
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, documentation updates
- **MINOR** (1.0.0 → 1.1.0): New features, backward-compatible changes
- **MAJOR** (1.0.0 → 2.0.0): Breaking changes

### 2. Create and Push a Git Tag

```bash
# Create the tag (replace X.Y.Z with your version)
git tag v1.2.3

# Push the tag to trigger the release
git push origin v1.2.3
```

### 3. Monitor the Release

1. Go to the [Actions tab](https://github.com/AgentBossMode/DGUI/actions) in GitHub
2. Look for the "Publish Packages" workflow triggered by your tag
3. Verify both Python and JavaScript publishing jobs complete successfully

## What Happens Automatically

When you push a tag, the GitHub Actions workflow will:

1. **Extract Version**: Parse the version from the tag (e.g., `v1.2.3` → `1.2.3`)
2. **Update Versions**: Run `scripts/bump-version.sh` to update:
   - `python/pyproject.toml`
   - All 6 JavaScript `package.json` files
   - Internal dependencies between packages
3. **Build & Publish Python**: Build and publish to PyPI
4. **Build & Publish JavaScript**: Build and publish all 6 npm packages

## Package List

The following packages are automatically versioned and published:

### Python (PyPI)
- `dgui-schema` - Type-safe UI schema definitions

### JavaScript (npm)
- `@dgui/core` - Core dynamic UI factory
- `@dgui/schemas` - Type definitions for UI schemas
- `@dgui/adapters` - Framework adapter definitions
- `@dgui/material-ui` - Material UI adapter
- `@dgui/ant-design` - Ant Design adapter
- `@dgui/chakra-ui` - Chakra UI adapter

## Conventional Commits

We use conventional commits to help determine version bumps:

- `feat:` → MINOR version bump
- `fix:` → PATCH version bump
- `BREAKING CHANGE:` → MAJOR version bump
- `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `build:`, `ci:`, `chore:` → PATCH version bump

## Rollback

If a release has issues:

1. **Immediate**: Delete the tag if not yet published
   ```bash
   git tag -d v1.2.3
   git push origin :refs/tags/v1.2.3
   ```

2. **After Publishing**: Create a new patch release with fixes
   ```bash
   git tag v1.2.4
   git push origin v1.2.4
   ```

## Troubleshooting

### Release Failed
- Check the GitHub Actions logs for specific error messages
- Ensure all required secrets are configured:
  - `PYPI_API_TOKEN` for Python publishing
  - `NPM_TOKEN` for JavaScript publishing

### Version Already Exists
- PyPI and npm will reject duplicate versions
- Create a new version number (usually increment patch)

### Manual Version Bump
If you need to manually bump versions (not recommended):
```bash
./scripts/bump-version.sh 1.2.3
```

## Examples

### Creating a Patch Release
```bash
# Bug fix release
git tag v1.2.1
git push origin v1.2.1
```

### Creating a Minor Release
```bash
# New feature release
git tag v1.3.0
git push origin v1.3.0
```

### Creating a Major Release
```bash
# Breaking change release
git tag v2.0.0
git push origin v2.0.0
```
