# Pantau Pemilu 2024

> This project is still in development so there will be frequent code changes

## Introduction

Pantau Pemilu 2024 is a project to monitor the 2024 election in Indonesia. This project is a scraper to get the data from the KPU website.

This project was created using [Bun](https://bun.sh), fast all-in-one JavaScript runtime.

Build with:

- Runtime: [Bun](https://bun.sh)
- ORM Database: [Drizzle](https://orm.drizzle.team/)
- Schema Validation: [Zod](https://zod.dev/)
- Logging: [Pino](https://getpino.io/)

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

Open database studio:

```bash
bun db:studio
```

## Available Commands

Template commands: {election} {command}

Election list:

- `pilpres`
- `dpr`
- `dpd`
- `dprd-prov`
- `dprd-kabkot`

Available commands:

You can see all available here: [src/index.ts](src/index.ts)

- `bun start pilpres get-wilayah`
- `bun start pilpres get-tps-detail`
- `bun start pilpres get-tps-detail-2`
- `bun start pilpres update-tps-detail`

