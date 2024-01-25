# Scraper Starter

Dead simple scraper starter project.

This project was created using [Bun](https://bun.sh), fast all-in-one JavaScript runtime.

Build with:

- Runtime: [Bun](https://bun.sh)
- ORM Database: [Drizzle](https://orm.drizzle.team/)
- Schema Validation: [Zod](https://zod.dev/)

## Getting Started

Clone the repository:

```bash
git clone https://github.com/zakiego/scraper-starter.git
```

Install dependencies:

```bash
bun install
```

Generate and migrate database:

```bash
bun db:generate && bun db:migrate
```

Run the script:

```bash
bun start
```

Open database studio:

```bash
bun db:studio
```
