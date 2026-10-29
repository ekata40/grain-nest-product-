import { product } from './product';

export type Order = {
  orderId: string; dateTime: string; name: string; phone: string; email: string; location: string;
  productName: string; quantity: number; pricePerPiece: number; deliveryFee: number; totalPrice: number;
  paymentMethod: string; status: string; notes: string;
};

function env(name: string) { return process.env[name]?.trim(); }
function missingIntegrationSettings() {
  const required = [
    ['Google Sheets', 'GOOGLE_SHEET_ID'],
    ['Google Sheets', 'GOOGLE_SHEET_TAB_NAME'],
    ['Google Sheets', 'GOOGLE_SERVICE_ACCOUNT_EMAIL'],
    ['Google Sheets', 'GOOGLE_PRIVATE_KEY'],
    ['Email', 'SMTP_HOST'],
    ['Email', 'SMTP_PORT'],
    ['Email', 'SMTP_USER'],
    ['Email', 'SMTP_PASS'],
    ['Email', 'BUSINESS_EMAIL'],
    ['Email', 'EMAIL_FROM'],
  ] as const;
  return required.filter(([, key]) => !env(key)).map(([group, key]) => ({ group, key }));
}
export function integrationStatus() {
  const missing = missingIntegrationSettings();
  return { sheet: !missing.some(x => x.group === 'Google Sheets'), mail: !missing.some(x => x.group === 'Email'), missing };
}

function escapeHtml(value: string) { return value.replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c] || c)); }
function money(value: number) { return new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(value); }
function sheetDateTimeSerial(value: string) {
  const date = new Date(value);
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kathmandu', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(date).map(part => [part.type, part.value]));
  const localTime = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute), Number(parts.second), date.getUTCMilliseconds());
  return localTime / 86400000 + 25569;
}

async function saveOrder(order: Order) {
  // Load server-only integrations on demand so the storefront and confirmation page
  // can still compile when credentials/dependencies have not been configured yet.
  // webpackIgnore keeps optional server integrations out of the client/dev bundle.
  // They are still loaded by Node when an order is submitted and configured.
  const { google } = await import(/* webpackIgnore: true */ 'googleapis');
  const privateKey = env('GOOGLE_PRIVATE_KEY')?.replace(/\\n/g, '\n');
  const auth = new google.auth.JWT({ email: env('GOOGLE_SERVICE_ACCOUNT_EMAIL'), key: privateKey, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = env('GOOGLE_SHEET_ID')!;
  const tab = env('GOOGLE_SHEET_TAB_NAME')!;
  const headers = ['Order ID','Date & Time','Customer Name','Phone Number','Email Address','Exact Location','Product Name','Quantity','Price Per Piece','Delivery Fee','Total Price','Payment Method','Order Status','Notes'];
  let metadata;
  try {
    metadata = await sheets.spreadsheets.get({ spreadsheetId, fields: 'sheets.properties(sheetId,title,gridProperties(rowCount))' });
  } catch (error) {
    const apiError = error as { code?: number; response?: { status?: number } };
    if (apiError.code === 403 || apiError.response?.status === 403) {
      throw new Error(`Google Sheets denied access. Share the spreadsheet with ${env('GOOGLE_SERVICE_ACCOUNT_EMAIL')} as an Editor, then retry.`);
    }
    throw error;
  }
  const existing = metadata.data.sheets?.some(s => s.properties?.title === tab);
  if (!existing) throw new Error(`Google Sheet tab "${tab}" was not found. Create the tab and add the README column headers.`);
  const read = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${tab}!A1:N1` });
  const current = read.data.values?.[0] || [];
  if (!current.length) await sheets.spreadsheets.values.update({ spreadsheetId, range: `${tab}!A1:N1`, valueInputOption: 'RAW', requestBody: { values: [headers] } });
  else if (headers.some((h,i) => current[i] !== h)) throw new Error('Google Sheet columns do not match the expected headers. See README.');
  await sheets.spreadsheets.values.append({ spreadsheetId, range: `${tab}!A:N`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[order.orderId, sheetDateTimeSerial(order.dateTime), order.name, order.phone, order.email, order.location, order.productName, order.quantity, order.pricePerPiece, order.deliveryFee, order.totalPrice, order.paymentMethod, order.status, order.notes]] } });

  // Apply a calm, readable order-management layout after each append so new rows
  // inherit the same visual treatment even when the sheet starts out unformatted.
  const sheetId = metadata.data.sheets?.find(s => s.properties?.title === tab)?.properties?.sheetId;
  if (sheetId !== undefined) {
    const rowCount = Math.max(metadata.data.sheets?.find(s => s.properties?.title === tab)?.properties?.gridProperties?.rowCount || 1000, 1000);
    await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: [
      { updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 1, hideGridlines: true } }, fields: 'gridProperties.frozenRowCount,gridProperties.hideGridlines' } },
      { repeatCell: { range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 14 }, cell: { userEnteredFormat: { backgroundColor: { red: 0.25, green: 0.30, blue: 0.22 }, textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontSize: 10 }, horizontalAlignment: 'CENTER', verticalAlignment: 'MIDDLE', wrapStrategy: 'WRAP' } }, fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)' } },
      { updateDimensionProperties: { range: { sheetId, dimension: 'ROWS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 42 }, fields: 'pixelSize' } },
      { repeatCell: { range: { sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: 0, endColumnIndex: 14 }, cell: { userEnteredFormat: { textFormat: { foregroundColor: { red: 0.19, green: 0.21, blue: 0.17 }, fontSize: 10 }, verticalAlignment: 'MIDDLE', wrapStrategy: 'CLIP' } }, fields: 'userEnteredFormat(textFormat.foregroundColor,textFormat.fontSize,verticalAlignment,wrapStrategy)' } },
      { updateDimensionProperties: { range: { sheetId, dimension: 'ROWS', startIndex: 1, endIndex: rowCount }, properties: { pixelSize: 34 }, fields: 'pixelSize' } },
      { repeatCell: { range: { sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: 1, endColumnIndex: 2 }, cell: { userEnteredFormat: { numberFormat: { type: 'DATE_TIME', pattern: 'mmm d, yyyy hh:mm' } } }, fields: 'userEnteredFormat.numberFormat' } },
      { repeatCell: { range: { sheetId, startRowIndex: 1, endRowIndex: rowCount, startColumnIndex: 8, endColumnIndex: 11 }, cell: { userEnteredFormat: { numberFormat: { type: 'CURRENCY', pattern: '"NPR" #,##0' } } }, fields: 'userEnteredFormat.numberFormat' } },
      ...[230,230,210,150,240,320,220,90,160,150,160,160,150,240].map((pixelSize, index) => ({ updateDimensionProperties: { range: { sheetId, dimension: 'COLUMNS', startIndex: index, endIndex: index + 1 }, properties: { pixelSize }, fields: 'pixelSize' } })),
    ] } });
  }
}

function detailRows(order: Order) {
  const row = (label: string, value: string) => `<tr><td style="padding:9px 0;color:#70776b;font-size:13px">${label}</td><td style="padding:9px 0;text-align:right;color:#252820;font-size:13px;font-weight:600">${value}</td></tr>`;
  return row('Order ID', escapeHtml(order.orderId)) + row('Product', escapeHtml(order.productName)) + row('Quantity', String(order.quantity)) + row('Price per piece', money(order.pricePerPiece)) + row('Delivery fee', money(order.deliveryFee)) + row('Total', money(order.totalPrice)) + row('Payment', 'Cash on Delivery');
}
function emailShell(title: string, body: string) {
  const brand = escapeHtml(env('BRAND_NAME') || 'Grain Nest');
  return `<!doctype html><html><body style="margin:0;background:#f5f5ef;font-family:Arial,sans-serif;color:#252820"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:28px 10px;background:#f5f5ef"><tr><td align="center"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#fff;border:1px solid #e8e8df"><tr><td style="padding:23px 28px;background:#414b39;color:#fff;font-size:18px;font-weight:bold">${brand}<span style="float:right;font-size:10px;color:#d9decf;letter-spacing:1px">ORDER UPDATE</span></td></tr><tr><td style="padding:30px 28px"><h1 style="margin:0 0 10px;font-size:23px;color:#30352b">${title}</h1>${body}</td></tr><tr><td style="padding:16px 28px;border-top:1px solid #ededE6;color:#777;font-size:11px">${brand} · Cash on Delivery</td></tr></table></td></tr></table></body></html>`;
}

async function sendEmails(order: Order) {
  const nodemailer = (await import(/* webpackIgnore: true */ 'nodemailer')).default;
  const transporter = nodemailer.createTransport({ host: env('SMTP_HOST'), port: Number(env('SMTP_PORT')), secure: Number(env('SMTP_PORT')) === 465, auth: { user: env('SMTP_USER'), pass: env('SMTP_PASS') } });
  const summary = `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:20px 0;border-top:1px solid #ecece5;border-bottom:1px solid #ecece5">${detailRows(order)}</table>`;
  const ownerHtml = emailShell('A new order has arrived', `<p style="font-size:14px;line-height:1.7;color:#62675d">A customer has submitted a Cash on Delivery order. Please contact them soon to confirm.</p><h3 style="margin:22px 0 5px;font-size:14px">Customer details</h3><p style="font-size:13px;line-height:1.8;color:#555">${escapeHtml(order.name)}<br>${escapeHtml(order.phone)}<br>${escapeHtml(order.email)}<br>${escapeHtml(order.location)}</p>${summary}<p style="padding:14px;background:#f4f5ef;color:#49543e;font-size:13px;font-weight:bold">Please call the customer soon to confirm this order.</p>`);
  const brand = escapeHtml(env('BRAND_NAME') || 'Grain Nest');
  const customerHtml = emailShell(`Thank you, ${escapeHtml(order.name)}!`, `<p style="font-size:14px;line-height:1.7;color:#62675d">We have received your order successfully. Here are your order details:</p>${summary}<p style="padding:14px;background:#f4f5ef;color:#49543e;font-size:13px;line-height:1.7">Our sales representative will call you soon to confirm your order.</p><p style="font-size:13px;line-height:1.8;color:#62675d">Questions? Reply to this email or contact <a style="color:#536044" href="mailto:${escapeHtml(env('EMAIL_FROM')!)}">${escapeHtml(env('EMAIL_FROM')!)}</a>.</p><p style="font-size:13px;color:#62675d">Thank you,<br><strong>${brand}</strong></p>`);
  const from = env('EMAIL_FROM')!;
  const results = await Promise.allSettled([
    transporter.sendMail({ from: `"${env('BRAND_NAME') || 'Grain Nest'}" <${from}>`, to: env('BUSINESS_EMAIL'), replyTo: from, subject: `New Product Order Received - ${order.orderId}`, html: ownerHtml }),
    transporter.sendMail({ from: `"${env('BRAND_NAME') || 'Grain Nest'}" <${from}>`, to: order.email, replyTo: from, subject: `Your Order Has Been Received - ${env('BRAND_NAME') || 'Grain Nest'}`, html: customerHtml }),
  ]);
  const failures = results.flatMap((r,i) => r.status === 'rejected' ? [`${i === 0 ? 'business' : 'customer'} email: ${r.reason instanceof Error ? r.reason.message : 'delivery failed'}`] : []);
  if (failures.length) throw new Error(`Order saved to Google Sheets, but ${failures.join('; ')}. Contact support before asking the customer to resubmit.`);
}

export async function submitOrder(data: Record<string, unknown>) {
  const status = integrationStatus();
  if (!status.sheet || !status.mail) {
    const missing = status.missing.map(x => x.key).join(', ');
    throw new Error(`Order submission is not configured yet. Add these settings to the project .env.local file: ${missing}. Restart the dev server after saving.`);
  }
  if (product.price <= 0) throw new Error('The product price is not configured yet. Ask the store owner to set the price before ordering.');
  const quantity = Number(data.quantity);
  const order: Order = {
    orderId: `GN-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${crypto.randomUUID().slice(0,8).toUpperCase()}`,
    dateTime: new Date().toISOString(), name: String(data.name).trim(), phone: String(data.phone).trim(), email: String(data.email).trim(), location: String(data.location).trim(),
    productName: product.name, quantity, pricePerPiece: product.price, deliveryFee: product.deliveryFee,
    totalPrice: product.price * quantity + product.deliveryFee, paymentMethod: 'Cash on Delivery', status: 'New Order', notes: '',
  };
  await saveOrder(order);
  await sendEmails(order);
  return order;
}
