# Deploying AURELIA to Netlify with staff-editable content (DecapBridge)

This site is a static HTML/CSS/JS site with one added piece: a small Node
build script that lets non-technical staff edit menu items, photos,
testimonials, hours, and copy through a web-based admin panel
(`/admin`), powered by [Decap CMS](https://decapcms.org). Netlify Identity —
the login system Decap CMS traditionally used on Netlify — has been
discontinued, so this site uses [DecapBridge](https://decapbridge.com)
instead, a free drop-in replacement that lets staff log in with an email/
password or SSO instead of needing their own GitHub account.

Nobody but you (the developer) needs to do the setup below. Once it's done,
staff only ever see the simple screen described in "Day-to-day use for
staff" at the bottom.

## How it fits together

```
Staff edits a menu item in /admin
        │  (Decap CMS commits a JSON file to your GitHub repo)
        ▼
GitHub repo (content/menu-items/m1.json changes)
        │  (push triggers a Netlify build automatically)
        ▼
Netlify runs: node scripts/build-content.js
        │  (compiles content/ → data/*.json that the site fetches)
        ▼
Site redeploys — the live page shows the new content within ~1 minute
```

There's no database and no server to maintain — content lives as JSON files
right in your Git history, so every edit is version-controlled and
revertible like any other code change.

## One-time setup

### 1. Push this code to a new GitHub repository

If you don't already have one:

1. Create a new repository on GitHub (public or private both work).
2. From this project's folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### 2. Deploy the site to Netlify

1. Log in to [app.netlify.com](https://app.netlify.com) and choose **Add new site → Import an existing project**.
2. Connect your GitHub account and pick the repository you just pushed.
3. Netlify will detect `netlify.toml` automatically — the build command
   (`node scripts/build-content.js`) and publish directory (`.`) are already
   set, so you can leave the defaults and click **Deploy**.
4. Once it finishes, note your site's URL (something like
   `https://your-site-name.netlify.app`). You can rename it under
   **Site configuration → General → Site details → Change site name**.

### 3. Set up DecapBridge (staff login for the CMS)

1. Go to [decapbridge.com](https://decapbridge.com) and create a free account
   (covers up to 3 sites and 10 staff logins — plenty for one restaurant site).
2. Click **Add site** and fill in:
   - **Git provider:** GitHub
   - **Repository:** `YOUR_USERNAME/YOUR_REPO` (exactly as on GitHub)
   - **Access token:** you'll need a GitHub *fine-grained personal access
     token* — create one at
     [github.com/settings/tokens](https://github.com/settings/tokens) scoped
     to just this repository, with **read/write access to Contents** (and
     **Pull requests** too, only if you turn on Editorial Workflow later).
     Paste that token into DecapBridge.
   - **CMS login URL:** `https://your-site-name.netlify.app/admin/index.html`
   - **Auth type:** "Classic" is simplest (email + password); pick "PKCE" if
     you want staff to sign in with Google/Microsoft SSO instead.
3. After saving, DecapBridge shows you an **Identity URL** for this site
   (looks like `https://auth.decapbridge.com/sites/xxxxxxxx`).

### 4. Point `admin/config.yml` at your real values

Open `admin/config.yml` in this project and update the three placeholders
near the top:

```yaml
backend:
  name: git-gateway
  repo: YOUR_USERNAME/YOUR_REPO          # ← your real GitHub repo
  branch: main
  identity_url: https://auth.decapbridge.com/sites/xxxxxxxx   # ← from step 3
  gateway_url: https://gateway.decapbridge.com

site_url: https://your-site-name.netlify.app     # ← your real Netlify URL
display_url: https://your-site-name.netlify.app
```

Commit and push this change — Netlify redeploys automatically, and `/admin`
is now live.

### 5. Invite staff

Back in DecapBridge, open your site and go to **Manage collaborators** to
send email invitations. Staff pick their own login method (password or SSO)
when they accept — they never need a GitHub account.

### 6. Add real photos

Right now every photo on the site is a placeholder from Unsplash. Staff (or
you) can replace them one at a time through the CMS — see below — or you can
drop real files into `images/uploads/` yourself and update the image fields
to point at them.

## Day-to-day use for staff

1. Go to `https://your-site-name.netlify.app/admin` and log in.
2. Pick a section on the left: **Site Settings** (hours, contact info, hero
   text, About copy, section headings), **Menu Items**, **Signature
   Dishes**, **Gallery Photos**, **Testimonials**, or **Why Choose Us**.
3. Click an existing entry to edit it, or **New [Item]** to add one. For
   photos, click the image field to upload a file straight from your
   computer — no need to find a URL.
4. Click **Publish** (or **Save** if Editorial Workflow is on — see below).
5. The change is live on the site within about a minute, once Netlify
   finishes rebuilding. You can watch build progress on your Netlify
   dashboard if you want to confirm.

A few things worth knowing:

- **Menu item categories** must exactly match one of the categories listed
  in **Site Settings → Menu Categories** (the tabs on the Menu section). If
  you rename a category there, update it on every menu item using the old
  name too, or those dishes will stop showing up under any tab.
- **Display Order** fields control the order things appear in (lowest
  number first) — set these when adding a new dish/photo/testimonial to
  place it where you want.
- Deleting an entry in the CMS removes it from the live site on the next
  build; it's not gone for good — it's still in your GitHub history and can
  be restored from there if needed.

## Optional: require review before publishing

By default, staff edits go live immediately (`publish_mode: simple` in
`admin/config.yml`). If you'd rather have a manager approve changes first,
change that line to:

```yaml
publish_mode: editorial_workflow
```

This makes every save open a draft that shows up under a review queue in the
CMS instead of publishing immediately. It requires your GitHub token (from
step 3) to also have **Pull requests** read/write access.

## Local preview (for developers)

Because the content-aggregation step needs Node, a plain double-click on
`index.html` will show the site using its last-generated (or built-in
fallback) content, but won't reflect edits you make to files under
`/content` until you rebuild:

```bash
node scripts/build-content.js   # regenerates data/*.json from content/
python3 -m http.server 8000     # or any static file server
# then open http://localhost:8000
```

To preview the CMS locally (rather than on Netlify), see
[Decap CMS's local backend docs](https://decapcms.org/docs/beta-features/#working-with-a-local-git-repository) —
it lets you run `npx decap-server` alongside a local dev server so you can
test content edits without touching your real GitHub repo.

## Troubleshooting

- **"/admin" shows a blank page or login loop:** double-check the three
  values in `admin/config.yml` (repo, identity_url) exactly match what
  DecapBridge and GitHub show you — a typo in the repo name is the most
  common cause.
- **A build fails on Netlify:** check the deploy log — `scripts/build-
  content.js` will report exactly which content file has invalid JSON if
  that's the cause (Decap CMS itself shouldn't ever produce invalid JSON,
  but a manual edit to a file in `content/` could).
- **A saved edit doesn't show up on the live site:** confirm the Netlify
  deploy triggered by that commit actually succeeded (Netlify dashboard →
  Deploys) — Decap CMS committing successfully and Netlify's build
  succeeding are two separate steps.
