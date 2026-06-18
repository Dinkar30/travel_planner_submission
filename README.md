# Nomichi Trip Desk — Engineering Intern Build

This is my submission for the Nomichi Engineering Intern build assignment. The goal was to move the team's workflow from manual Google Sheets into a dedicated, working web application.

## Core Functions

I built this app in three connected parts to ensure a lead moves smoothly from first contact to a confirmed seat:

1. **Public Enquiry Page** — A mobile-first page where travellers can see open trips and send an enquiry. I used Zod for form validation to ensure the team gets clean data (valid emails and phone numbers).

2. **Team Admin (The CRM)** — A secure area for the Nomichi team to see all leads.
   - **Lead List**: A searchable table to see who has applied.
   - **Lead Detail View**: A dedicated page for each traveller where the team can update their status (NEW to CONFIRMED).
   - **Call Log**: A notes system to save timestamped records of conversations with travellers.

3. **Trips CMS** — A management tool where the team can create or edit trips (change prices, dates, or status) without touching the code.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database & Auth**: Supabase (Postgres)
- **Styling**: Tailwind CSS + Shadcn/UI
- **Form Handling**: React Hook Form + Zod

## Key Decisions & Trade-offs

- **Native UI for Stability**: I chose to use native HTML select elements for the dropdowns. While less "fancy" than some library components, they are 100% reliable on mobile devices and prevented bugs that would have frustrated the user.

- **Relational Schema**: I set up the database so that Leads are directly linked to Trips in Postgres. This means if a trip's name or price is updated in the CMS, it reflects correctly everywhere in the CRM.

- **Brand Alignment**: I strictly followed the Nomichi brand guide, using the provided hex codes (#D55D27 Rust, #FFFBF5 Cream) and keeping the UI "calm" with no exclamation marks in the copy.

## How to Run Locally

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Access the admin panel at `/login`.

## Future Improvements

Given more time, I would:

- Add a visual dashboard with charts to show lead conversion rates.
- Integrate an AI "Vibe Check" to help the team prioritize enquiries based on the traveller's message.
- Implement Row-Level Security (RLS) to restrict data access based on team roles.
