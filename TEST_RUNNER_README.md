Playwright Test Setup

1. Install dependencies:

```bash
npm install
npx playwright install
```

2. Run tests:

```bash
npm test
```

Notes:
- Tests use local `file://` URLs to open `index.html`, `login.html`, and `payment.html`.
- If you prefer a local server, run a static server (e.g., `npx http-server` or `python -m http.server`) and update `tests/e2e.spec.js` to use `http://localhost:8080/` URLs.

CI
--
This repository includes a GitHub Actions workflow that will run the Playwright tests on push and pull requests.
To enable it, push the project to GitHub (branch `main` or `master`). The workflow is at `.github/workflows/playwright.yml` and installs dependencies, Playwright browsers, then runs `npm test`.
