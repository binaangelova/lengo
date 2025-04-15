export const createRateLimiter = (limit = 5, timeWindow = 60000) => {
  let tokens = limit;
  let lastRefill = Date.now();

  const refillTokens = () => {
    const now = Date.now();
    const timePassed = now - lastRefill;
    const refillAmount = Math.floor(timePassed / timeWindow) * limit;
    tokens = Math.min(limit, tokens + refillAmount);
    lastRefill = now;
  };

  return {
    tryRequest: () => {
      refillTokens();
      if (tokens > 0) {
        tokens--;
        return true;
      }
      return false;
    }
  };
};
