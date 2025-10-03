# Expensight

Expensight is a lightweight travel expense audit dashboard. It lets you upload CSV/Excel expense files, processes and groups records by department, and provides an interactive dashboard along with a small assistant chat for quick queries (e.g. "hotel spending").

This README documents how to run the app locally, how the program processes uploaded files, expected file formats, and tips for troubleshooting.

## Quick start (local)

Requirements:
- Node.js (recommended >= 18)
- pnpm (optional; npm/yarn supported)

Install dependencies and run the dev server:

```bash
cd "/Users/seonghooncheon/Desktop/Job Element/PORT/Expensight/Expensight"
pnpm install
pnpm dev
```

Open http://localhost:3000 in your browser. The app uses Next.js and runs in development mode for live reloads.

## Program flow (what happens when you use the app)

1. Upload files
	- Navigate to the Upload screen (sidebar → Upload) and drag-and-drop or choose files.
	- Supported formats: CSV, XLSX, XLS. Files are uploaded to the server API at `/api/upload` (the API currently accepts the file and returns success; file storage is not persisted by default).

2. Parse files
	- CSV files are parsed client-side by the file parser utilities.
	- Excel files (.xlsx/.xls) are parsed using the Excel parser helper.
	- Parsed rows are normalized into the `ExpenseRecord` shape used by the dashboard.

3. Process records
	- After parsing, the app groups records by department (DPTID) and runs `processDashboardData` to compute aggregates used by the Overview and Department views.
	- Once processing completes, the UI automatically switches to the Overview screen.

4. Explore dashboard
	- Overview: aggregate spend by category (hotel, car, airfare, meals, exceptions, past due) plus charts and quick stats.
	- Department view: click a department in the sidebar to see department-specific metrics and records.

5. Chat assistant
	- A small floating assistant helps answer simple questions against the currently loaded dataset (for example: "hotel spending", "who failed audit").

## File format expectations

At minimum, a parsed file should contain columns similar to:
- Employee Name
- Employee ID
- Employee Department (DPTID)
- Parent Expense Type (hotel, car, airfare, meals, etc.)
- Expense Type (sub-category)

The Upload page provides an "Expected File Format" card describing required columns.

## Useful scripts

- Start dev server: `pnpm dev` (or `npm run dev`)
- Build for production: `pnpm build`
- Start production server: `pnpm start`

These scripts are defined in `package.json`.

## API

- POST /api/upload
  - Accepts multipart form data with a `file` field.
  - Current implementation logs file info and returns a success JSON. If you want to persist uploads, add storage (S3, local disk, etc.) in `app/api/upload/route.ts`.

## Troubleshooting

- Error: `ReferenceError: window is not defined`
  - Cause: some components access `window` at module or render time. Components that rely on browser-only globals should guard access using `typeof window !== 'undefined'` or run initialization inside `useEffect`.
  - Fix: check components that use `window` and wrap access in client-only effects. (I patched `components/chatbot.tsx` so it initializes floating-widget coordinates inside `useEffect`.)

- Build/type issues
  - If you see TypeScript/Next types missing, ensure dev dependencies are installed and the TypeScript version is compatible with your environment.

## Next steps / recommendations

- Persist uploaded files if you want audit history: implement storage in `app/api/upload/route.ts`.
- Add unit tests for the file parser (`utils/file-parser.ts`) and dashboard processor (`utils/data-processor.ts`).
- Improve assistant: connect to a server-side LLM or add richer parsing rules for natural language queries.

## Contact / contribution

Open issues or create PRs against this repository. Small improvements (better error messages, stricter validation for input files) are welcome.
