# Grain Nest Cash on Delivery funnel

This project uses Next.js App Router, React, and Tailwind CSS. The product details and editable selling price live in `src/lib/product.ts`. The store is configured for Cash on Delivery only; there is no online payment gateway.

## Before accepting orders

1. The selling price is set to NPR 3,250, with NPR 3,500 crossed out, a 7% discount badge, and a flat NPR 150 delivery fee per order.
2. Add the business email, sender email, Google Sheet settings, and SMTP credentials to `.env.local` locally or to the hosting provider's server environment. Never add private credentials to `NEXT_PUBLIC_*` variables or commit `.env.local`.
3. `BRAND_NAME` defaults to “Grain Nest.” `EMAIL_FROM` should contain only the sender email address; the app adds the brand name to it.
4. Use the project's supported Node.js version and install dependencies with `npm install`.

## Google Sheets setup

1. Create a Google Spreadsheet for incoming orders.
2. Create a tab named `Orders` (or change `GOOGLE_SHEET_TAB_NAME`).
3. Share the spreadsheet with the service account email as an Editor.
4. In Google Cloud, enable the Google Sheets API, create a service account, and generate a JSON key. Set `GOOGLE_SERVICE_ACCOUNT_EMAIL` to the key's `client_email` and `GOOGLE_PRIVATE_KEY` to its `private_key`. In `.env.local`, preserve the PEM header/footer; encode newlines as `\n` if your deployment environment requires it. The server converts literal `\n` back to newline characters.
5. The spreadsheet ID is the string between `/d/` and `/edit` in the spreadsheet URL; set `GOOGLE_SHEET_ID` to it.
6. The API creates row 1 with the expected column names if the tab is empty. Otherwise, ensure row 1 contains these columns, in this order:

   `Order ID`, `Date & Time`, `Customer Name`, `Phone Number`, `Email Address`, `Exact Location`, `Product Name`, `Quantity`, `Price Per Piece`, `Delivery Fee`, `Total Price`, `Payment Method`, `Order Status`, `Notes`

7. In Google Sheets, select the header and choose **Data → Create a filter**. To manage order status, select the Order Status column and choose **Data → Data validation → Dropdown** with `New Order`, `Order Confirmed`, `Order Ongoing`, `Delivered`, and `Cancelled`.

## Email setup

The backend sends email through SMTP using Nodemailer after appending the order to the spreadsheet. For Gmail, set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER` to the sending Gmail address, and `SMTP_PASS` to a Google App Password (not the ordinary account password). Set `EMAIL_FROM` to that verified sender and `BUSINESS_EMAIL` to the inbox that receives new order notices. Set `BRAND_NAME` for the email header and `FRONTEND_URL`/`NEXT_PUBLIC_SITE_URL` to the deployed site's origin. The `EMAIL_SERVICE_API_KEY` variable is reserved for a future email-service adapter; the current code uses SMTP.

The sheet is the durable order record. Both notification emails are attempted only after the sheet append succeeds. If an email fails after the append, the API returns an explicit error saying the order is already recorded; check the sheet before resubmitting so you do not create a duplicate.

## Local development and deployment

1. Copy `.env.example` to `.env.local` and fill in values. For the UI alone, credentials can remain blank, but order POSTs will return a configuration error.
2. Run `npm install`, then `npm run dev` and visit `http://localhost:3000`.
3. `GET /api/order` reports whether required Sheet and SMTP settings are present. Place a test order after configuring the price and credentials. Check the appended row, both email inboxes, and the thank-you page. Use a test spreadsheet and email accounts first.
4. The GitHub repository is connected to Vercel. Its production branch is `master`; pushes to this branch trigger production deployments. Add server environment variables in Vercel's Project Settings for Production and Preview. `FRONTEND_URL` and `NEXT_PUBLIC_SITE_URL` should use the site's HTTPS origin. Keep rotated Google and SMTP credentials in Vercel only; do not commit them.

## Product content

The landing page currently uses the two high-resolution product images supplied with the request. They are optimized WebP source files (about 188 KB and 214 KB) and are served by Next.js Image. The provided first image includes marketing comparison text, so the gallery labels describe the product rather than treating that embedded text as store copy. More product photos may be added to `public/images` and registered in `src/lib/product.ts`.

No testimonials, product video links, or final price were provided. The page does not invent customer reviews or show a reels section. The FAQ copy is general product guidance; check the supplied product care and capacity details before publishing.

## Order flow

The landing page's quantity is passed to `/checkout`. The browser submits only customer contact/location details and quantity to `POST /api/order`; the server calculates product name, unit price, delivery, and total from `src/lib/product.ts`, validates the inputs, appends the row, then sends owner and customer emails. On success, the browser stores the returned order summary for the thank-you page and redirects there. The API checks `Origin` against the configured site URLs when an Origin header is present.
