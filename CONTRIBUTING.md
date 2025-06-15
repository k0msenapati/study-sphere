# Contributing to Study Sphere

First off, thank you for considering contributing to Study Sphere! 🙌

---

## Getting Started

1. **Fork the repository**
2. **Clone your fork**

```bash
git clone https://github.com/<your-username>/study-sphere.git
cd study-sphere
```

3. **Set up the project**

   * Follow the [Development Guide](./DEVELOPMENT.md) to install and run locally.

---

## Contributing Guidelines

### Project Setup Instructions

* Make sure you have `bun` installed: [https://bun.sh](https://bun.sh)
* Install dependencies:

```bash
bun install
```

* Run the development server:

```bash
bun run dev
```

* Format and lint code:

```bash
bun run format
bun run lint
```

### Branching Strategy

* Always branch out from `main`:

```bash
git checkout -b feat/your-feature-name
```

* Use these prefixes for your branches:

| Type    | Prefix   |
| ------- | -------- |
| Feature | `feat/`  |
| Fix     | `fix/`   |
| Docs    | `docs/`  |
| Chore   | `chore/` |

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```bash
git commit -m "feat(component): add navbar component"
```

### Pull Request Process

* Ensure your PR includes a clear title and description.
* Link to any relevant issues.
* Add screenshots or demos if applicable.
* PRs should:

  * Pass lint and formatting checks
  * Be reviewed by at least one maintainer
  * Be rebased or merged cleanly with `main`

---

## How to File a Bug

* Open an [issue](https://github.com/k0msenapati/study-sphere/issues)
* Choose **Bug Report** template
* Include:

  * Steps to reproduce
  * Expected vs actual behavior
  * Screenshots or logs if helpful

---

## How to Request a Feature

* Open an [issue](https://github.com/k0msenapati/study-sphere/issues)
* Choose **Feature Request** template
* Describe:

  * The problem you're solving
  * Why it's important
  * Your proposed solution

---

## Pull Request Checklist

Before submitting your pull request, please ensure the following:

* [ ] **Clear title and description** that explain what the PR does
* [ ] **Follows the branching strategy** (`feat/`, `fix/`, etc.) and **uses Conventional Commits**
* [ ] Code is **well-formatted** and passes lint checks:

  ```bash
  bun run format && bun run lint
  ```
* [ ] Includes **tests** or **relevant usage examples**, if applicable
* [ ] All **new/updated components are documented**
* [ ] Screenshots/demos included (for UI changes)
* [ ] Linked to a related **issue** (if one exists)
* [ ] PR is up-to-date with the `main` branch (`git pull origin main` before pushing)
* [ ] Ready for review: tagged with appropriate labels (e.g., `enhancement`, `bug`, `docs`)
* [ ] Reviewed and approved by at least one maintainer

---

## Useful Resources

* [Bun Documentation](https://bun.sh/docs)
* [Conventional Commits Guide](https://www.conventionalcommits.org/en/v1.0.0/)
* [Open Source Guide](https://opensource.guide/how-to-contribute/)

---

## Code of Conduct

We follow the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). Be respectful, inclusive, and collaborative in all contributions.

---

Let’s build something great together!
