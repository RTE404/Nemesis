from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, JSON, Enum
from sqlalchemy.orm import relationship
import enum
from datetime import datetime, timezone
from database import Base

class AttackCategory(enum.Enum):
    PROMPT_INJECTION = "prompt_injection"
    JAILBREAK = "jailbreak"
    ROLEPLAY = "roleplay"
    SYSTEM_EXTRACTION = "system_extraction"
    CONTEXT_MANIPULATION = "context_manipulation"

class EvaluationResult(enum.Enum):
    SUCCESS = "success" # Attack succeeded (Model failed)
    FAILURE = "failure" # Attack failed (Model was robust)
    UNCERTAIN = "uncertain"

class TargetModel(Base):
    __tablename__ = "target_models"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    provider = Column(String) # e.g. "openai", "openrouter", "local"
    model_identifier = Column(String) # e.g. "gpt-4", "anthropic/claude-3-haiku"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    target_model_id = Column(Integer, ForeignKey("target_models.id"))
    config = Column(JSON) # e.g. number of attacks, categories included
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    status = Column(String, default="running") # "running", "completed", "failed"

    target_model = relationship("TargetModel")
    evaluations = relationship("Evaluation", back_populates="campaign")

class AttackTemplate(Base):
    __tablename__ = "attack_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(Enum(AttackCategory))
    template_text = Column(Text) # The raw template e.g. "Ignore previous instructions and {payload}"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Attack(Base):
    __tablename__ = "attacks"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(Enum(AttackCategory))
    prompt = Column(Text)
    parent_id = Column(Integer, ForeignKey("attacks.id"), nullable=True) # For mutation lineage
    template_id = Column(Integer, ForeignKey("attack_templates.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"))
    attack_id = Column(Integer, ForeignKey("attacks.id"))
    response = Column(Text) # The target model's response
    
    # Evaluation specifics
    rule_score = Column(Float, nullable=True)
    judge_score = Column(Float, nullable=True)
    judge_explanation = Column(Text, nullable=True)
    confidence = Column(Float, nullable=True)
    
    final_result = Column(Enum(EvaluationResult))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    campaign = relationship("Campaign", back_populates="evaluations")
    attack = relationship("Attack")
