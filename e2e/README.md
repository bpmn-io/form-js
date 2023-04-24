# E2E Tests

## Visual regression

To run the visual regression tests follow the steps below:
1. Bootstrap the project with `npm ci` and `npm run build`
2. Run `npm run start:container`
3. Start the local server with `npm run start:visual-preview`
4. Run the visual regression tests with `npm run test:visual`

***If you need to update the screenshots run `npm run test:visual --update-snapshots`***