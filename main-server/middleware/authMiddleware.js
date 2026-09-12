const { prisma } = require("../services/prismaService");

/**
 * Middleware to require authentication via server-side session.
 * Loads user from database and attaches to req.user.
 */
const requireAuth = async (req, res, next) => {
  try {
    // 1. Check if session exists and contains userId
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    // 2. Validate Origin / Referer for CSRF protection on state-changing methods
    const mutatingMethods = ["POST", "PUT", "PATCH", "DELETE"];
    if (mutatingMethods.includes(req.method)) {
      const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5174";
      const origin = req.get("origin");
      const referer = req.get("referer");

      if (origin) {
        try {
          if (new URL(origin).origin !== new URL(allowedOrigin).origin) {
            return res.status(403).json({
              status: "error",
              message: "Invalid request origin",
            });
          }
        } catch (_) {}
      } else if (referer) {
        try {
          if (new URL(referer).origin !== new URL(allowedOrigin).origin) {
            return res.status(403).json({
              status: "error",
              message: "Invalid request origin",
            });
          }
        } catch (_) {}
      }
    }

    // 3. Load user from database using session user identity
    const user = await prisma.user.findUnique({
      where: {
        userId: req.session.userId,
      },
    });

    if (!user) {
      // Destroy invalid session safely
      req.session.destroy((err) => {
        if (err) console.error("Error destroying invalid session:", err);
      });
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    // 4. Attach application user identity to req.user
    req.user = {
      id: user.id,
      userId: user.userId,
    };

    return next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    return res.status(401).json({
      status: "error",
      message: "Authentication required",
    });
  }
};

module.exports = {
  requireAuth,
};
