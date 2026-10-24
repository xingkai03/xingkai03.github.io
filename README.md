# Personal website and Calories

The personal calorie tracker is at `/calories/`, with Supabase email/password
access, private storage, optional 30-day device memory, food references, daily
macros, history, and JSON/CSV backups. See [the setup guide](docs/calories-setup.md)
for the one-account database setup. The public project connection is configured;
the database setup SQL must be run before storing entries.

Run `npm run test:calories` (Node 22.18+ or Node 24 recommended) for calculation,
data validation, session expiry, and save conflict checks. Run `npm run dev` and
open `/calories/` for local development; `npm run build` prepares GitHub Pages.

## Site

Built with [Astro](https://docs.astro.build) from the blog starter. `npm run dev` serves it at
`localhost:4321`, `npm run build` writes `dist/`, and pushes to `main` deploy to GitHub Pages
after the Calories tests pass.

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).
