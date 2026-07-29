# Israel SOF Book — Working Manuscript

This private branch is the version-control home for Ami Pedahzur's book manuscript on Israeli special operations forces.

> **Confidential working material.** Do not merge this branch into `master` or `gh-pages`, publish it through GitHub Pages, or redistribute it without the author's approval.

## Current draft

- Canonical, diffable source: [`manuscript/Book.md`](manuscript/Book.md)
- Current Word export: [`exports/Book.docx`](exports/Book.docx)
- Editorial cleanup record: [`editorial/cleanup-audit.md`](editorial/cleanup-audit.md)
- Versioning protocol: [`VERSIONING.md`](VERSIONING.md)
- Change history: [`CHANGELOG.md`](CHANGELOG.md)

The Markdown manuscript is canonical for version comparison. The Word file is a generated working export with native endnotes.

## Branch policy

The manuscript lives on the dedicated `book-manuscript` branch. The repository's data and GitHub Pages work remain separate. Manuscript changes should be committed in small, meaningful units, preferably one chapter or one editorial operation per commit.

Suggested commit messages:

```text
docs(manuscript): revise chapter 5
docs(notes): verify chapter 3 citations
docs(export): refresh Word manuscript
```

## Baseline

The initial baseline was created on 29 July 2026 from the deduplicated May 2026 compilation. Earlier duplicate drafts and production scaffolding were removed while the original source remained preserved in the private Second-Brain vault.
