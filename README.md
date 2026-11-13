# astermediaplayer.com

The static website for Aster Media Player. Every file here is served as-is by nginx.

**Publishing:** push to `main`. The server checks GitHub every minute and pulls new commits, so a change is live within about a minute.

Don't edit the copy on the server: the next sync resets it to `main`. Scripts and styles are cached for 5 minutes, so you don't need to bump `?v=` for a change to show.
