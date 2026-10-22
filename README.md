# ANMOL KASHYAP — Interactive Portfolio

A responsive, dark-chrome portfolio for a first-year BCA student. Built with HTML, CSS and vanilla JavaScript, with an optional Firebase Firestore contact form. The hero monogram is CSS-based (not WebGL), so it runs on many mobile devices without a 3D graphics dependency.

## Files

- `index.html` — page structure and content
- `style.css` — visual design, responsiveness, animation and reduced-motion rules
- `script.js` — navigation, interactive monogram, sound toggle, filters, dialogs and Firebase form integration
- `firebase/firestore.rules` — Firestore rules for create-only contact submissions
- `firebase/firebase.json` — optional Firebase Hosting / Firestore CLI config
- `assets/images/` — favicon and social preview placeholders

## Run on Android with SPCK

1. Extract the project ZIP.
2. In SPCK Editor, open/import the `ANMOL-PORTFOLIO` folder.
3. Open `index.html` and use Preview. If the preview blocks remote ES modules, preview the page in Chrome through a static web server or deploy to Firebase Hosting/GitHub Pages.
4. The site works before Firebase setup; the contact form will explain that Firebase is not configured.

## Configure Firebase contact form

1. Open https://console.firebase.google.com/ and create a project.
2. In Project settings, add a Web app and copy its Firebase web configuration.
3. Open `script.js`; replace the placeholder values in `FIREBASE_CONFIG`. Do not paste service-account JSON or private server credentials into frontend code.
4. In Firebase Console, create a Cloud Firestore database.
5. Deploy `firebase/firestore.rules` using Firebase CLI, or copy the rules into Firestore → Rules and publish them.
6. Test a valid contact submission. The message should appear in Firestore under `portfolioMessages`.
7. Optional but recommended: configure Firebase App Check for your web app to reduce automated abuse. Test it in monitoring mode first, then enforce it after verifying the integration.
8. The rules allow public create-only submissions; visitors cannot read or delete messages. This is not a complete anti-spam/rate-limit system. For a public production site, consider App Check and/or a trusted Cloud Function or server-side form provider with rate limiting.

### Firebase web config and security

The Firebase web config is designed to be present in a browser and is not a private key. Security comes from Firestore rules, App Check and careful project configuration. Never put a service account key, SMTP password, private API token or admin credential in `script.js`.

The form stores name, email, message, source and a server timestamp. It does not automatically email you. To receive an email notification, add a trusted Cloud Function/email extension or connect a form/email service. Do not give public visitors read access to the messages collection.

## Deploy with Firebase Hosting (recommended if using Firebase)

The Firebase CLI normally runs on a computer or cloud shell, not directly inside SPCK. From a computer with Node.js installed:

```bash
npm install -g firebase-tools
firebase login
cd ANMOL-PORTFOLIO
firebase init
```

Choose Firestore and Hosting, use the existing project, set the public directory to `.` for the portfolio root, configure as a single-page app: `No`, and do not overwrite `index.html`. Then deploy rules and hosting:

```bash
firebase deploy --only firestore:rules,hosting
```

Note: `firebase/firebase.json` is provided as a reference. Firebase CLI expects `firebase.json` at the project root. If using the CLI, move/copy the file from `firebase/firebase.json` to the root and adjust the Firestore rules path to `firebase/firestore.rules`, or run `firebase init` and keep the generated root config. Example root `firebase.json`:

```json
{
  "firestore": { "rules": "firebase/firestore.rules" },
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**", "README.md"]
  }
}
```

If you only want GitHub Pages, deploy `index.html`, `style.css`, `script.js` and `assets/`. The static site can be hosted there, but Firestore rules must still be published in Firebase Console/CLI. GitHub Pages does not host Firebase backend code.

## Deploy with GitHub Pages

1. Create a GitHub repository.
2. Upload the contents of this folder to the repository root (not the ZIP itself).
3. In the repository, open Settings → Pages.
4. Select “Deploy from a branch”, choose `main` and `/ (root)`, then Save.
5. Wait for the Pages build and open the provided URL.
6. Confirm all paths are case-sensitive and test on mobile.
7. Configure Firebase independently using the steps above.

## Customize content

- Name, social links and Firebase config: `script.js`
- Text, projects, skills and learning timeline: `index.html`
- Colors, layout, breakpoints and animations: `style.css`
- Favicon/social preview: `assets/images/`
- Creative gallery: replace placeholder artwork in `index.html`/`style.css` with your real images, and update alt text/descriptions.

Replace placeholder social URLs with your actual profiles. Do not label a project “completed” or “live” until it is genuinely finished and deployed.

## Testing checklist

- [ ] Mobile menu opens and closes and its links navigate
- [ ] AK monogram responds to tap and drag
- [ ] Sound starts OFF and only plays after explicit opt-in
- [ ] Project and creative filters work
- [ ] Project/art dialogs open and close
- [ ] Contact form validates input
- [ ] Firebase form submission succeeds after configuration and rules deployment
- [ ] Firestore visitors cannot read messages
- [ ] Reduced-motion preference removes most motion
- [ ] Test at 320px, 375px, tablet and desktop widths
- [ ] Check browser console for errors
- [ ] Verify all social links and hosting URLs before sharing

## Troubleshooting

- **Contact form says Firebase is not configured:** update all placeholder values in `FIREBASE_CONFIG`.
- **Permission denied:** enable Firestore and publish `firebase/firestore.rules`.
- **Firebase import fails in editor preview:** use Chrome or deploy to an HTTPS static host; some embedded previews restrict remote JavaScript modules.
- **Message stored but no email arrives:** Firestore stores submissions; email notifications need a separately configured service.
- **GitHub Pages shows a 404:** verify Pages is enabled and the HTML file is at the repository root.
- **Fonts do not load:** the page falls back to system fonts when Google Fonts are unavailable.
