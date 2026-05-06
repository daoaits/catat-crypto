import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Database
  const users: any[] = [];
  const profiles: any[] = [];

  // API Routes
  app.post("/api/register", (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = { id: Date.now().toString(), name, email, password };
    users.push(newUser);
    
    // Auto login for onboarding
    res.json({ 
      message: "Registration successful", 
      user: { id: newUser.id, name: newUser.name, email: newUser.email } 
    });
  });

  app.post("/api/onboarding", (req, res) => {
    const { userId, ...profileData } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    let profile = profiles.find(p => p.userId === userId);
    if (profile) {
      Object.assign(profile, profileData);
    } else {
      profile = { userId, ...profileData };
      profiles.push(profile);
    }

    res.json({ message: "Profile updated successfully", profile });
  });

  app.get("/api/users", (req, res) => {
    res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email })));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
