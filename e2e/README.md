# E2E Tests

## Visual regression

The reference screenshots (`e2e/visual/**/*-snapshots/*.png`) are **platform specific**, e.g. `theming---viewer-1-chromium-linux.png`. They are generated on Linux inside the [official Playwright container](https://mcr.microsoft.com/en-us/artifact/mar/playwright) used in CI. Always (re)build them inside that same container—snapshots generated directly on your host (macOS / Windows) will not match CI and will fail the checks.

### Running the tests locally

1. Bootstrap the project on your host with `npm ci` and `npm run build`
2. Enter the Playwright container with `npm run start:container` (mounts the repository at `/work`)
3. **Inside the container**, run the tests with `npm run test:e2e`

Step 3 chains building the mock website (`npm run build:e2e`), starting the preview server on port `8080` (`npm run start:visual-preview`), and running the tests (`npm run test:visual`). You can also run those steps individually if needed.

**_If you need to update the screenshots run `npm run test:visual -- --update-snapshots` (inside the container)._**

**_If you're using Apple silicon and get an error with ESBuild run `npm i vite --force --no-save` inside the Docker container after step 2 to fix it._**

### Updating snapshots via CI (recommended)

Instead of rebuilding snapshots locally, you can let CI regenerate them on the correct platform:

1. Push your branch and open a pull request.
2. Add the **`update-snapshots`** label to the pull request.

The [`Update Visual Regression Snapshots`](../.github/workflows/UPDATE_VISUAL_SNAPSHOTS.yml) workflow then runs the tests with `--update-snapshots` inside the Playwright container and commits the refreshed screenshots back to your branch (`chore: updated snapshots`).
