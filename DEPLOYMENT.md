# Deployment record

Updated 16 November 2026.

- Canonical public site: https://heckel75.github.io/World-News-Archive/
- Public repository: https://github.com/heckel75/World-News-Archive
- Initial GitHub Pages deployment verified at 14:19 UTC on 23 October 2026 in run https://github.com/heckel75/World-News-Archive/actions/runs/39968173614 .
- Research and editorial review take place in ChatGPT, followed by publication of reviewed edition files. The website has no research API client or scheduled research workflow.
- No OpenAI API key is required.
- The existing hosted task is scheduled daily around 08:00 Europe/Paris. Only the edition files and successful deployments establish what has actually been published.
- The initial Sites demo, https://world-news-archive-ke-2026.zanystork18.chatgpt.site/ , remains a separate static release and is not the canonical archive.

The GitHub workflows only validate the saved edition files, build the static site and deploy it. Research and editorial review occur in ChatGPT. A successful content commit still requires a successful Pages deployment before the change is live.

See [README.md](README.md) for setup/costs and [docs/EDITORIAL.md](docs/EDITORIAL.md) for research, source verification and corrections.

API-removal release verified: https://github.com/heckel75/World-News-Archive/actions/runs/39970968785 succeeded for commit 11bc8a7df8beebacc1bed51d06a6f75b2ebf5025.

October 22 edition: https://github.com/heckel75/World-News-Archive/actions/runs/39972337532 succeeded for commit 56f1da2bf2ce561059d09cddae277898d9052b2b and was verified on the public site.

October 23 edition: commit d3898121432cd5b2d036231a344a929209a5d232 was deployed on October 26. Deployment https://github.com/heckel75/World-News-Archive/actions/runs/40295123595 passed and the edition was verified on the public site.

October 25 edition: commit 321c9187c9de45ccfeef35605f3bec0d45382b25 and successful deployment https://github.com/heckel75/World-News-Archive/actions/runs/40296738552 . The edition was verified on the public site.

October 24 edition: commit a079963ea5782f39a3e8ae5e8ad26865d41bf732 and successful deployment https://github.com/heckel75/World-News-Archive/actions/runs/40297642090 .

November 15 edition: commit c9c267cb8a9d80ba4d1abaad2b185beb365d4a8c and successful deployment https://github.com/heckel75/World-News-Archive/actions/runs/43826268358 . As checked on November 16, the public archive contains every completed daily edition from October 22 through November 15, plus the January 20, 2025 retrospective.

The build versions its application script and catalog request together so a new deployment does not reuse a cached older catalog. GitHub Pages may still take a few minutes to refresh its document cache after deployment.
