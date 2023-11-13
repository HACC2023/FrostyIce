# Makai

The Center for Marine Debris Research (CMDR) needs a scalable and modern solution for its reporting system. Currently, there is no centralized database for incoming reports, and data is scattered across various Google Drives, Microsoft Access databases, and Excel spreadsheets. As a result, accurate tracking is challenging, and data analysis becomes nearly impossible. The solution to this problem is Makai, a mobile-friendly marine debris reporting platform designed for the Center for Marine Debris Research. It is intended for use by both the public and organizations responsible for large debris removal. Makai features a centralized database that stores all incoming debris reports in one place, enabling marine debris researchers to accurately monitor types of debris and debris hotspots.

<!-- # Table of Contents

1. [Getting Started](#getting-started) -->

# Getting Started

1. Change into the `my-app` directory and run `npm install`
2. Get the appropriate secrets as specified in the `.env.local` file
3. Create a `.env.local` file inside the `my-app` directory
4. The `.env.local` file should contain secrets for Uploadthing, Next-Auth, MongoDB Atlas, Mapbox, NodeMailer. The file should look like this:
   ```
   MONGO_DB_URI=
   UPLOADTHING_SECRET=
   UPLOADTHING_APP_ID=
   NEXTAUTH_SECRET=
   NEXTAUTH_URL=
   NEXT_PUBLIC_MAPBOX_TOKEN=
   NODEMAILER_EMAIL=
   EMAIL_PASS=
   DEFAULT_PASSWORD= 
   ```
5. Run `npm run dev` to start the development server

