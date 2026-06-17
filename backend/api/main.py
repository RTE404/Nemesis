from fastapi import FastAPI, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from models.schema import TargetModel, Campaign
from campaigns.orchestrator import CampaignOrchestrator
from metrics.scorer import MetricsScorer
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv() # Load variables from .env file

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Red Teaming Platform")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ModelCreate(BaseModel):
    name: str
    provider: str
    model_identifier: str

class CampaignCreate(BaseModel):
    name: str
    target_model_id: int
    categories: List[str]
    count_per_category: int

@app.post("/api/models")
def register_model(model: ModelCreate, db: Session = Depends(get_db)):
    db_model = TargetModel(name=model.name, provider=model.provider, model_identifier=model.model_identifier)
    db.add(db_model)
    db.commit()
    db.refresh(db_model)
    return db_model

@app.get("/api/models")
def list_models(db: Session = Depends(get_db)):
    return db.query(TargetModel).all()

@app.get("/api/models/{model_id}/metrics")
def get_model_metrics(model_id: int, db: Session = Depends(get_db)):
    scorer = MetricsScorer(db)
    return scorer.get_model_robustness(model_id)

@app.post("/api/campaigns")
def create_campaign(campaign: CampaignCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    config = {
        "categories": campaign.categories,
        "count_per_category": campaign.count_per_category
    }
    db_campaign = Campaign(name=campaign.name, target_model_id=campaign.target_model_id, config=config)
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)

    # Run in background
    orchestrator = CampaignOrchestrator(db) # In a real app we'd want a fresh session per task
    background_tasks.add_task(orchestrator.run_campaign, db_campaign.id)

    return db_campaign

@app.get("/api/campaigns")
def list_campaigns(db: Session = Depends(get_db)):
    return db.query(Campaign).all()

@app.get("/api/campaigns/{campaign_id}/metrics")
def get_campaign_metrics(campaign_id: int, db: Session = Depends(get_db)):
    scorer = MetricsScorer(db)
    return scorer.get_campaign_metrics(campaign_id)

@app.get("/api/dashboard")
def get_dashboard_overview(db: Session = Depends(get_db)):
    # Aggregate stats
    models = db.query(TargetModel).count()
    campaigns = db.query(Campaign).count()
    
    scorer = MetricsScorer(db)
    all_campaigns = db.query(Campaign).all()
    
    total_attacks = 0
    total_successful = 0
    
    for c in all_campaigns:
        m = scorer.get_campaign_metrics(c.id)
        total_attacks += m.get("total_attacks", 0)
        total_successful += m.get("successful_attacks", 0)
        
    avg_vuln = (total_successful / total_attacks * 100) if total_attacks > 0 else 0
    
    return {
        "total_models": models,
        "total_campaigns": campaigns,
        "total_attacks": total_attacks,
        "successful_attacks": total_successful,
        "average_vulnerability": round(avg_vuln, 2)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
