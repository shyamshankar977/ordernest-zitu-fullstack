# OrderNest + Zitu full-stack starter projects

Both projects use React + Vite on the frontend and Node.js + Express on the backend. Demo data is held in memory, so it resets when the backend restarts. These are interview/demo starter projects, not production systems.

## Requirements
- Node.js 20+ (Node 22 recommended)
- Internet access for the first `npm install`

## Run OrderNest
Open two terminals.

Terminal 1:
```bash
cd ordernest/backend
npm install
npm start
```
Backend: http://localhost:5000/api/health

Terminal 2:
```bash
cd ordernest/frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal (usually http://localhost:5173).

## Run Zitu
Open two more terminals.

Terminal 1:
```bash
cd zitu/backend
npm install
npm start
```
Backend: http://localhost:5001/api/health

Terminal 2:
```bash
cd zitu/frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal (usually http://localhost:5173; Vite will choose another port if occupied).

## API routes
### OrderNest
- `GET /api/health`
- `GET /api/foods`
- `GET /api/orders`
- `POST /api/orders` with JSON `{ "customerName":"Sam", "items":[{"foodId":1,"quantity":2}] }`

### Zitu
- `GET /api/health`
- `GET /api/businesses?q=packaging&city=Chennai` (filters optional)
- `POST /api/enquiries` with JSON `{ "businessId":1,"senderName":"Sam","email":"sam@example.com","message":"I would like to discuss a supply partnership." }`
- `GET /api/enquiries`

## Notes
- No database is configured in this quick demo; arrays are in-memory. Add MySQL/MongoDB and authentication before production use.
- Do not put secrets in frontend files.
