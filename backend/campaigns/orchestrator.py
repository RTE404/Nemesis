from sqlalchemy.orm import Session
from models.schema import Campaign, TargetModel, AttackCategory
from attacks.generator import AttackGenerator
from evaluation.hybrid_evaluator import HybridEvaluator
from evaluation.hybrid_evaluator import HybridEvaluator
# pyrefly: ignore [missing-import]
from utils.llm import robust_completion as completion

class CampaignOrchestrator:
    def __init__(self, db: Session):
        self.db = db
        self.generator = AttackGenerator(db)
        self.evaluator = HybridEvaluator(db)

    def _query_target_model(self, target_model: TargetModel, prompt: str) -> str:
        """
        Sends the prompt to the target model using litellm.
        """
        try:
            # target_model.model_identifier should be a litellm compatible string, e.g. "openai/gpt-4o"
            res = completion(
                model=target_model.model_identifier,
                messages=[{"role": "user", "content": prompt}]
            )
            return res.choices[0].message.content
        except Exception as e:
            print(f"Error querying target model {target_model.name}: {e}")
            return ""

    def run_campaign(self, campaign_id: int):
        campaign = self.db.query(Campaign).filter(Campaign.id == campaign_id).first()
        if not campaign:
            return

        target_model = campaign.target_model
        
        # Read config
        # config example: {"categories": ["prompt_injection"], "count_per_category": 5}
        config = campaign.config or {}
        categories = config.get("categories", [c.value for c in AttackCategory])
        count = config.get("count_per_category", 5)

        for cat_str in categories:
            cat_enum = AttackCategory(cat_str)
            
            # Generate attacks
            attacks = self.generator.generate_with_llm(cat_enum, count)
            # attacks.extend(self.generator.generate_from_template(cat_enum, count)) # Optional
            
            for attack in attacks:
                # Execute attack
                response = self._query_target_model(target_model, attack.prompt)
                
                # Evaluate response
                self.evaluator.evaluate_response(campaign.id, attack, response)

        # Mark campaign as completed
        campaign.status = "completed"
        self.db.commit()
