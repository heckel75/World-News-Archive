# Deployment record

Updated 26 October 2026.

- Canonical public site: https://heckel75.github.io/World-News-Archive/
- Public repository: https://github.com/heckel75/World-News-Archive
- Initial GitHub Pages deployment verified at 14:19 UTC on 23 October 2026 in run https://github.com/heckel75/World-News-Archive/actions/runs/39968173614 .
- The repository now uses ChatGPT research followed by explicit publication of reviewed edition files. The website's daily research workflow and OpenAI API client have been removed at the owner's request.
- No OpenAI API key is required. No research API run was executed during setup.
- Existing hosted task: World News History Archive, in Open Source News Archive. Active daily at 08:00 Paris time. On October 26 the owner authorized GitHub for this conversation and the paused schedule was resumed. Its full editorial requirements and recovery instructions were saved and verified. No duplicate schedule was created.
- The initial Sites demo, https://world-news-archive-ke-2026.zanystork18.chatgpt.site/ , remains a separate static release and is not the canonical archive.

The GitHub workflows only validate the saved edition files, build the static site and deploy it. Research and editorial review occur in ChatGPT. A successful content commit still requires a successful Pages deployment before the change is live.

See [README.md](README.md) for setup/costs and [docs/EDITORIAL.md](docs/EDITORIAL.md) for research, source verification and corrections.

API-removal release verified: https://github.com/heckel75/World-News-Archive/actions/runs/39970968785 succeeded for commit 11bc8a7df8beebacc1bed51d06a6f75b2ebf5025.

October 22 edition: https://github.com/heckel75/World-News-Archive/actions/runs/39972337532 succeeded for commit 56f1da2bf2ce561059d09cddae277898d9052b2b and was verified on the public site.

October 23 edition: the scheduled run prepared commit d3898121432cd5b2d036231a344a929209a5d232 on October 24 but stopped at GitHub publishing approval. The authorized branch update was retried successfully on October 26. Deployment https://github.com/heckel75/World-News-Archive/actions/runs/40295123595 passed and the new date was verified on the public site. Cached public files took several minutes to refresh. This was an assisted recovery, not proof of an unattended publish.

On October 26 a focused run of the same hosted task published the complete October 25 edition without another approval prompt: commit 321c9187c9de45ccfeef35605f3bec0d45382b25 and successful deployment https://github.com/heckel75/World-News-Archive/actions/runs/40296738552 . The rendered October 25 edition was also verified on the public site. The run was started using Run now; it tests the saved research-to-publish instructions but is not evidence that a later clock-triggered run has occurred.

A second focused run recovered October 24: commit a079963ea5782f39a3e8ae5e8ad26865d41bf732 and successful deployment https://github.com/heckel75/World-News-Archive/actions/runs/40297642090 . The repository now has complete daily editions for October 22 through 25, plus the original January 20, 2025 retrospective.

The build versions its application script and catalog request together so a new deployment does not reuse a cached older catalog. GitHub Pages may still take a few minutes to refresh its document cache after deployment.
