# Contribution Guidelines

Welcome to NIT KKR Hostel Management Systems! We love contributions. Here's how to help:

## Getting Started
1. **Fork** the repository and clone your fork. Make sure to copy all the branches.
1. Create and fill enviroment variables in .env file, as provided in `.env.sample` for both backend and frontend.
1. Install dependencies: `npm install` for both frontend and backend. 
1. Migrate and seed the database, make sure the db is already created in mysql with the same name as in .env file. 
```sh
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```
Run the project (frontend)
```
npm run dev
```
Backend
```
cd backend
npm run dev
```
## Contribution
1. Create a new branch: `git checkout -b my-feature-branch`
1. Make your changes.
1. Commit changes: `git commit -m "feat: add new feature"`
1. Push to your fork: `git push origin my-feature-branch`
1. Open a **Pull Request** (PR) against the `dev` branch.

## Code Style
- Follow existing code conventions.
- Use descriptive variable/function names.
- Keep commits atomic and messages clear (use [Conventional Commits](https://www.conventionalcommits.org/)).
- Lint your code before submitting.

## Pull Requests
- Reference related issues (e.g., `Closes #123`).
- Provide context: **what** you changed and **why**.
- Update documentation if needed.

## Reporting Issues
- Use the issue template (if available).
- Describe steps to reproduce the bug.
- Include OS/environment details.

## Need Help?
Ask the maintainers.