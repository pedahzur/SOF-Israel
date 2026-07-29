# Manuscript Versioning Protocol

## Canonical files

- `manuscript/Book.md` is the canonical, diffable manuscript.
- `exports/Book.docx` is the current Word working copy and must be regenerated
  from the same manuscript state.
- `CHANGELOG.md` records milestones rather than every minor correction.

## Commit rhythm

Commit after a coherent editorial operation: one chapter revision, one
citation-verification pass, one structural change, or one refreshed export.
Avoid combining unrelated chapter changes in the same commit.

Use Conventional Commits:

```text
docs(manuscript): revise chapter 5
docs(notes): verify chapter 3 citations
docs(structure): reorder chapter 8 sections
docs(export): refresh Word manuscript
```

## Milestones

Create a Git tag at major handoff points:

```text
draft-YYYY-MM-DD
review-YYYY-MM-DD
submission-v1
```

Before tagging a milestone:

1. Confirm that `manuscript/Book.md` and `exports/Book.docx` represent the same
   manuscript state.
2. Confirm that Word endnote references and endnotes have matching counts.
3. Update `CHANGELOG.md`.
4. Record unresolved sourcing and editorial questions.

## Privacy boundary

This branch contains unpublished manuscript prose. Do not merge it into
`master` or `gh-pages`, enable GitHub Pages for it, or add redistributable
copies of copyrighted source material. Research datasets should remain in
their existing data branches or dedicated repositories.
