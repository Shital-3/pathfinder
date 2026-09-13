const WINDOW_MS = 15 * 60_000;
const MAX_FAILED_ATTEMPTS = 5;
const buckets = new Map();

function getKey(req) {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "unknown";
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  return `${ip}:${email}`;
}

function cleanup(now) {
  for (const [key, entry] of buckets) {
    if (now - entry.startedAt >= WINDOW_MS) buckets.delete(key);
  }
}

export function loginRateLimiter(req, res, next) {
  const now = Date.now();
  cleanup(now);

  const key = getKey(req);
  const current = buckets.get(key);
  if (current && current.failedAttempts >= MAX_FAILED_ATTEMPTS && now - current.startedAt < WINDOW_MS) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - current.startedAt)) / 1000);
    res.set("Retry-After", String(retryAfter));
    return res.status(429).json({
      success: false,
      message: "Too many failed login attempts. Please try again later.",
    });
  }

  req.loginRateLimitKey = key;
  next();
}

export function recordFailedLogin(req) {
  const now = Date.now();
  const key = req.loginRateLimitKey || getKey(req);
  const current = buckets.get(key);

  if (!current || now - current.startedAt >= WINDOW_MS) {
    buckets.set(key, { startedAt: now, failedAttempts: 1 });
    return;
  }

  current.failedAttempts += 1;
}

export function clearFailedLogins(req) {
  const key = req.loginRateLimitKey || getKey(req);
  buckets.delete(key);
}
