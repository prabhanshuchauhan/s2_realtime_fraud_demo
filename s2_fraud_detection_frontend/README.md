# S2 Fraud Detection Demo Frontend

This is the Next.js frontend for the Real-Time Fraud Detection Demo using SingleStore. It provides a live dashboard, analytics, and API endpoints for fraud detection data.

## Features
- Real-time fraud analytics dashboard
- Interactive map and charts
- API endpoints for fraud data

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.sample` to `.env` and fill in your SingleStore database credentials:
```env
DB_HOST=your-singlestore-host
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
SINGLESTORE_CERT=your-ssl-cert-contents
```

### Using SingleStore SSL Certificates

To connect securely to SingleStore Cloud, you need to provide the CA certificate. This project uses an environment variable (`SINGLESTORE_CERT`) to store the certificate contents, which is compatible with Vercel and other serverless platforms.

To learn more about using singlestore with Node.js using SSL, check out [Connect with Node.js using SSL](https://docs.singlestore.com/cloud/developer-resources/connect-with-application-development-tools/connect-with-node-js/connect-with-node-js-using-ssl/).

**How to set `SINGLESTORE_CERT`:**
1. Download your CA certificate from the SingleStore Cloud portal (usually a `.pem` file).
2. Convert the file contents to a single line with `\n` for newlines. For example:
   ```bash
   awk 'NF {sub(/\r/, ""); printf "%s\\n", $0;}' path/to/ca-certificate.pem
   ```
   Copy the output and paste it as the value for `SINGLESTORE_CERT` in your `.env` file.
   
   Example:
   ```env
   SINGLESTORE_CERT=-----BEGIN CERTIFICATE-----\nMIID...\n...\n-----END CERTIFICATE-----\n
   ```
3. Do not commit your real certificate to version control. Only use `.env.example` for the variable name.

**Why this approach?**
- Works on Vercel and other platforms that don’t support file-based secrets.
- Keeps your deployment simple and secure.

### 3. Run locally
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000).

### 4. Deploy
Deploy easily to [Vercel](https://vercel.com/) or your preferred platform.

## API Endpoints
- `/api/fraud-summary` - Fraud summary stats
- `/api/fraud-map-points` - Map data for frauds
- `/api/fraud-timeseries` - Time series data
- `/api/fraud-top-cities` - Top cities with fraud
- `/api/frauds/[id]` - Details for a specific fraud
- `/api/potential-frauds` - List of potential frauds
- `/api/run-fraud-detection` - Trigger fraud detection
- `/api/analytics/summary` - Analytics summary
- `/api/stats` - General stats

## Project Structure
- `app/` - Next.js app directory
- `components/` - Reusable UI components
- `lib/` - Database and utility code
- `public/` - Static assets

## License
MIT
