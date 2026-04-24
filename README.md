# Hierarchy Insight Engine

A full-stack application to process hierarchical node relationships and visualize tree structures.

## Folder Structure
```
Hierarchy_Insight_Engine/
├── backend/
│   ├── processor.js      # Core logic for tree building & cycle detection
│   ├── server.js         # Express server & API endpoints
│   └── package.json      # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main UI component
│   │   ├── index.css     # Premium styling
│   │   └── main.jsx      # React entry point
│   ├── index.html        # HTML template
│   └── package.json      # Frontend dependencies
└── README.md             # Instructions
```

## Setup and Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
The server will run on `http://localhost:3000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The application will be available on `http://localhost:5173` (or the port Vite provides).

## API Documentation

### POST /bfhl
Processes hierarchical data.

**Request Body:**
```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

**Response Format:**
```json
{
  "user_id": "arrav_24042026",
  "email_id": "arrav@example.com",
  "college_roll_number": "SRM-12345",
  "hierarchies": [...],
  "invalid_entries": [...],
  "duplicate_edges": [...],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

## Sample Test Cases

1. **Standard Tree:** `{"data": ["A->B", "A->C", "B->D"]}`
2. **Multiple Trees:** `{"data": ["A->B", "X->Y"]}`
3. **Cycle Detection:** `{"data": ["A->B", "B->C", "C->A"]}`
4. **Invalid Entries:** `{"data": ["A->B", "hello", "1->2", "A->A"]}`
5. **Multi-parent:** `{"data": ["A->B", "C->B"]}` (C->B should be ignored)

## Deployment Steps

### Backend (Render/Railway)
1. Push the `backend/` folder to a GitHub repository.
2. Connect to Render/Railway.
3. Set the build command to `npm install`.
4. Set the start command to `node server.js`.

### Frontend (Vercel/Netlify)
1. Push the `frontend/` folder to a GitHub repository.
2. Connect to Vercel/Netlify.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.
5. Ensure the API URL in `App.jsx` points to your deployed backend.
