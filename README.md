## Fullstack Todo app 🙂

### Project description

Frontend:
- Vue 2 Composition API + Typescript
- Bootstrap
- Webpack 5 (manual config, no Vue CLI)

Backend:
- Express
- PostgreSQL
- Prisma

### How to run

1. Clone the repo
2. Enter `fullstack-todo-app` directory
3. Run `docker-compose up` command
4. App will be available on `http://localhost:7777`

### Known issues

- Wrong Nginx configuration for SPA (you'll get an error if try to refresh a page with URL different from homepage)
- No server compression which could improve Lighthouse score
- No `vendor` chunk extracting
- No unnecessary Bootstrap CSS classes purging

These will be fixed later.

