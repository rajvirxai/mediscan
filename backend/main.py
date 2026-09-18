from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import upload, results
from backend.db.database import engine, Base

# Create all tables in the engine
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MediScan MVP API")

# Configure CORS so the Next.js frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon/MVP, usually ["http://localhost:3000"] is better, but "*" is easier to start
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers
app.include_router(upload.router, tags=["Upload"])
app.include_router(results.router, tags=["Results"])

@app.get("/")
def read_root():
    return {"message": "MediScan API is running"}
