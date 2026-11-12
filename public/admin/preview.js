// Custom preview for blog posts and German notes in /admin.
//
// Sveltia's built-in preview doesn't know about LaTeX, so this renders the post
// body like the live site does: $…$ and $$…$$ with KaTeX, Markdown with marked,
// and the site's fonts and text width. ```mermaid blocks are shown as code here;
// they become diagrams on the live site.
(function () {
	const CMS = window.CMS;
	const { React } = CMS;
	const h = React.createElement;
	const origin = window.location.origin;

	// ---- Math --------------------------------------------------------------

	function renderMath(tex, displayMode) {
		try {
			return window.katex.renderToString(tex, { displayMode, throwOnError: false });
		} catch (error) {
			return `<code class="math-error">${escapeHtml(tex)}</code>`;
		}
	}

	function escapeHtml(text) {
		return text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
	}

	// Replace math with placeholders before Markdown runs (so `_` and `*` inside
	// formulas aren't turned into italics), then swap the rendered math back in.
	// Code blocks and inline code are left untouched.
	function markdownWithMath(source) {
		const math = [];
		const keep = (html) => `MATHPLACEHOLDER${math.push(html) - 1}END`;
		const parts = source.split(/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/);
		const text = parts
			.map((part, i) => {
				if (i % 2 === 1) return part; // code
				return part
					.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => keep(renderMath(tex.trim(), true)))
					.replace(/(^|[^\\$])\$([^$\n]+?)\$/g, (_, before, tex) => before + keep(renderMath(tex.trim(), false)))
					// ==highlight== (Obsidian-style), like the live site
					.replace(/==(?!\s)([^=\n]+?)(?<!\s)==/g, '<mark>$1</mark>');
			})
			.join('');
		const html = window.marked.parse(text, { gfm: true, breaks: false });
		return html.replace(/MATHPLACEHOLDER(\d+)END/g, (_, i) => math[Number(i)]);
	}

	// Images in the post that live in the repo (not https://…) are shown from the
	// editor's copy, so unsaved uploads appear too.
	function fixImageSources(html, getAsset) {
		return html.replace(/(<img\b[^>]*\bsrc=")([^"]+)(")/g, (match, start, src, end) => {
			if (/^(https?:|data:|blob:)/.test(src)) return match;
			const asset = getAsset(src);
			return asset && asset.url ? start + asset.url + end : match;
		});
	}

	// ---- Preview template --------------------------------------------------

	function formatDate(value) {
		if (!value) return '';
		const date = new Date(value);
		if (Number.isNaN(date.valueOf())) return String(value);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
	}

	function PostPreview({ entry, getAsset }) {
		const data = entry.get('data');
		const title = data.get('title') || '';
		const body = data.get('body') || '';
		const hero = data.get('heroImage');
		const heroAsset = hero ? getAsset(hero) : undefined;
		const heroUrl = heroAsset && heroAsset.url ? heroAsset.url : hero;

		let html;
		try {
			html = fixImageSources(markdownWithMath(body), getAsset);
		} catch (error) {
			html = `<pre>${escapeHtml(String(error))}</pre>`;
		}

		return h(
			'article',
			{ className: 'site-preview' },
			heroUrl ? h('img', { className: 'hero', src: heroUrl, alt: '' }) : null,
			h('p', { className: 'date' }, formatDate(data.get('pubDate'))),
			h('h1', null, title),
			h('hr'),
			h('div', { className: 'prose', dangerouslySetInnerHTML: { __html: html } }),
		);
	}

	for (const collection of ['blog', 'de']) {
		CMS.registerPreviewTemplate(collection, PostPreview);
	}

	// ---- Styles: KaTeX + a copy of the site's look -------------------------

	CMS.registerPreviewStyle('https://cdn.jsdelivr.net/npm/katex@0.16.27/dist/katex.min.css');
	CMS.registerPreviewStyle(
		`
		@font-face { font-family: "Atkinson"; src: url("${origin}/fonts/atkinson-regular.woff") format("woff"); font-weight: 400; }
		@font-face { font-family: "Atkinson"; src: url("${origin}/fonts/atkinson-bold.woff") format("woff"); font-weight: 700; }
		body { margin: 0; background: #fff; }
		.site-preview {
			font-family: "Atkinson", sans-serif; font-size: 18px; line-height: 1.7;
			color: rgb(34, 41, 57); max-width: 720px; margin: 0 auto; padding: 1.5em 1em 4em;
		}
		.site-preview h1, .site-preview h2, .site-preview h3, .site-preview h4 { color: rgb(15, 18, 25); line-height: 1.2; margin: 0 0 0.5rem; }
		.site-preview h1 { font-size: 2.6em; margin-top: 0.25rem; }
		.site-preview h2 { font-size: 2em; margin-top: 1.5rem; }
		.site-preview h3 { font-size: 1.6em; margin-top: 1.25rem; }
		.site-preview .date { color: rgb(96, 115, 159); margin: 1em 0 0; }
		.site-preview .hero { display: block; width: 100%; border-radius: 12px; }
		.site-preview hr { border: none; border-top: 1px solid rgb(229, 233, 240); margin: 1em 0 1.5em; }
		.site-preview a { color: #2337ff; }
		.site-preview img { max-width: 100%; height: auto; border-radius: 8px; display: inline-block; vertical-align: top; }
		.site-preview code { padding: 2px 5px; background: rgb(229, 233, 240); border-radius: 2px; }
		.site-preview pre { padding: 1.5em; border-radius: 8px; background: rgb(229, 233, 240); overflow-x: auto; }
		.site-preview pre > code { padding: 0; background: none; }
		.site-preview blockquote { border-left: 4px solid #2337ff; padding: 0 0 0 20px; margin: 0; font-size: 1.1em; }
		.site-preview table { border-collapse: collapse; }
		.site-preview th, .site-preview td { border: 1px solid rgb(229, 233, 240); padding: 0.3em 0.6em; }
		.site-preview .katex-display { overflow-x: auto; overflow-y: hidden; }
		.site-preview .math-error { color: #c00; }
		.site-preview mark { padding: 0 0.15em; border-radius: 3px; background: #fff1a8; color: inherit; }
		`,
		{ raw: true },
	);
})();
