# BankProductsManagement

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.0.


## Important Installation Note

**This project requires using `npm install --force` for successful installation due to dependency compatibility conflicts.**

### Technical Justification

The technical test specifically required:
- **Angular 14 or higher** → Implemented with Angular 21 (latest stable version)
- **Unit tests with Jest** → Configured Jest for testing
- **Minimum 70% coverage** → Achieved >80% coverage

**The conflict arises because:**
- Recent versions of `jest-preset-angular` (v15+) are compatible with Angular 21
- However, some transitive dependencies like `@angular-builders/jest@18.0.0` have specific peer dependencies for Angular 18
- Angular 21 introduces changes that require adjustments in testing tools

**Implemented solution:**
```bash
npm install --force


## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Jest]([https://karma-runner.github.io](https://jestjs.io/docs/getting-started)) test runner, use the following command:

```bash
ng test
```
```bash
ng test:coverage
```
## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
