## NestJS TypeORM Typescript Boilerplate

A ready to go boilerplate for starting Backend Development project with NestJS.

## Todos

- [x] TypeORM migrations
- [x] JWT Auth flow management
- [x] Redis integration
- [x] Feature access management
- [x] Send email
- [x] Winston logger integration
- [ ] Upload file
- [ ] Jest utilization

## Run Locally

Clone the project

```bash
$ git clone <repository-link>
```

Go to the project directory

```bash
$ cd nestjs-typeorm-ts
```

Install dependencies

```bash
$ pnpm install
```

Run at port 3000

```bash
# development
$ pnpm start

# watch mode
$ pnpm start:dev

# production mode
$ pnpm start:prod
```

## Migrations

```bash
# Generate a migration based on .entity.ts files
$ NAME=migration-name pnpm migration:generate

# Create an empty migration
$ NAME=migration-name pnpm migration:create

# Apply migration to database
$ pnpm migration:run
```

NAME= variable works on my Linux, I don't care about Windows

## Seeder

```bash
# Create empty seeder
$ NAME=seeder-name pnpm seed:create

# Run seeder
$ pnpm seed:run
```

NAME= variable works on my Linux, I don't care about Windows

## Authors

- [@Diaz-Adrianz](https://github.com/Diaz-adrianz)

## Feedback

If you have any feedback, please reach out me at [email](mailto:diazz.developer@gmail.com)

## License

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
