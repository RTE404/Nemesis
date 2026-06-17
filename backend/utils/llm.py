import time
from litellm import completion, RateLimitError, ServiceUnavailableError

def robust_completion(*args, **kwargs):
    max_retries = 5
    base_delay = 15

    for attempt in range(max_retries):
        try:
            return completion(*args, **kwargs)
        except (RateLimitError, ServiceUnavailableError) as e:
            if attempt == max_retries - 1:
                raise e
            print(f"LLM API rate limited or unavailable (attempt {attempt+1}/{max_retries}): {e}")
            time.sleep(base_delay * (attempt + 1))
        except Exception as e:
            # For any other exception, raise immediately so we can handle it at the call site
            raise e
