# Certify — Game On certificate generator

A starter Next.js app for participant-entered certificate generation.

## What works now
- Name entry with live certificate preview.
- A4 landscape PDF generation and download.
- Unique certificate ID and QR code.
- Verification route (`/verify/[id]`).
- Optional Supabase persistence for generated certificate records.
- Admin upload screen for PNG/JPG artwork (uploads to storage; does not replace the active template).

## Important
This MVP does **not** verify attendance. Anyone with the public link can enter a name and generate a certificate. The verification page confirms only that a certificate record exists, not that the person attended or that Google issued it. Do not describe the generated PDF as officially issued by Google unless Google has approved this workflow and certificate artwork.

## Run locally
1. Install Node.js 20+.
2. Copy `.env.example` to `.env.local`.
3. Create a Supabase project. Run `supabase/schema.sql` in its SQL editor.
4. Create a public Storage bucket named `certificate-assets` if you want to upload a template.
5. Add the Supabase project URL and anon key to `.env.local`.
6. Set `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
7. Run:
   ```bash
   npm install
   npm run dev
   ```
8. Open `http://localhost:3000`.

Without Supabase env vars, the PDF still downloads, but QR verification cannot look up stored records.

## Certificate artwork
The generator uses the supplied `public/certificate-template.png` artwork, adding the participant name and the event date (14 November 2026) in their blank areas. The PDF is rendered from the same preview. To replace the artwork, update this file and adjust the overlay positions in `app/certificate-name.css`. Uploads from the admin screen are stored in Supabase but do not change the active template.
