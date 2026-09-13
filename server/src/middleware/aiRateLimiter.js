const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
const buckets = new Map();

function cleanup(now) {
  for (const [key, entry] of buckets) {
    if (now - entry.startedAt >= WINDOW_MS) buckets.delete(key);
  }
}

export default function aiRateLimiter(req, res, next) {
  const now = Date.now();
  cleanup(now);
  const key = req.user?.id ? `user:${req.user.id}` : `ip:${req.ip || req.socket.remoteAddress || "unknown"}`;
  const current = buckets.get(key);

  if (!current || now - current.startedAt >= WINDOW_MS) {
    buckets.set(key, { startedAt: now, count: 1 });
    return next();
  }

  current.count += 1;
  if (current.count > MAX_REQUESTS) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - current.startedAt)) / 1000);
    res.set("Retry-After", String(retryAfter));
    return res.status(429).json({
      success: false,
      message: "Too many AI requests. Please try again in a minute.",
    });
  }

  next();
}
