# How to publish

This folder is the content of xingkai03.github.io. Write here; when you push,
the site rebuilds in about a minute.

## New post
1. Create a note in `blog/` (or `de/` for German notes). The file name becomes the
   web address: `blog/my-new-post.md` → `/blog/my-new-post/`. Use lowercase and dashes.
2. Run **Templates: Insert template** (Cmd+P) → *Blog post* to add the header.
3. Fill in `title` and `description`. Leave `draft: true` while you work.
4. When it's ready, change `draft` to `false`.

## Publish
Cmd+P → **Git: Commit-and-sync** (pull, commit, push). Drafts are pushed too but
stay hidden on the site until `draft: false`.

## Writing
- Math: `$x^2$` inline, `$$ … $$` on its own lines.
- Diagrams: a ```` ```mermaid ```` code block.
- Images: paste or drag in. They're saved in an `attachments/` folder next to the
  post and inserted as `![…](attachments/…)`, which the site optimises.
- Images in hand-written HTML (e.g. a row of photos in `<p><img …></p>`) must be
  full `https://` links (e.g. from Cloudinary); local files only work as `![…](…)`.

## Not here
Projects, apps, profile, CV and photo are easiest to edit at
https://xingkai03.github.io/admin
