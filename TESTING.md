# Automated Testing

The first regression-testing layer checks that the backend starts correctly,
the health endpoint responds, protected routes reject unauthenticated requests,
and the frontend production build succeeds.

## Run locally

Run all checks used by CI:

```bash
npm run test:ci
```

Run only backend API smoke tests:

```bash
npm test
```

Run only the frontend production build:

```bash
npm run build
```

The repository's existing `npm run lint` command currently reports a large
pre-existing backlog, so lint is not a required CI check yet. Fix that backlog
before adding lint to `test:ci`.

## Adding a regression test

When fixing a backend bug:

1. Add a test to `backend/tests/` that reproduces the bug.
2. Confirm the test fails before the fix.
3. Implement the fix.
4. Confirm `npm run test:ci` passes.

Test files must end with `.test.js`.

## Pull requests and deployment

Every pull request targeting `master` runs `.github/workflows/ci.yml`.
Every push to `master` must pass the same checks before the Docker image is
built and deployed.

Enable branch protection for `master` in GitHub and require the
`Pull Request Checks / test` status check. Also disable direct pushes to
`master` so changes cannot bypass review and CI.

## Next testing milestones

1. Add authenticated API tests using a dedicated MySQL test database.
2. Add React component tests with Vitest and React Testing Library.
3. Add Playwright tests for critical student, admin, and super-admin flows.
4. Add coverage reporting after the initial critical flows are protected.
