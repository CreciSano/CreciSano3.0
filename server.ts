import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import {
  INITIAL_COMMUNITY_POSTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_RECIPES,
} from './src/data/recipes.ts';
import type {
  AppNotification,
  CommunityPost,
  DayOfWeek,
  MealSlot,
  NotificationPreferences,
  Recipe,
  UserProfile,
  WeeklyMealPlan,
} from './src/types.ts';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', '.data')
  : path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'crecisano-db.json');
const BUNDLED_DB_FILE = path.resolve(process.cwd(), '.data', 'crecisano-db.json');

let inMemoryDb: DatabaseSchema | null = null;

interface StoredUser extends UserProfile {
  passwordHash: string;
}

interface DatabaseSchema {
  users: StoredUser[];
  sessions: Record<string, string>;
  recipes: Recipe[];
  favorites: Record<string, string[]>;
  mealPlans: Record<string, WeeklyMealPlan>;
  communityPosts: CommunityPost[];
  notifications: AppNotification[];
}

function createEmptyMealPlan(): WeeklyMealPlan {
  const days: DayOfWeek[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  const plan = {} as WeeklyMealPlan;
  for (const day of days) {
    plan[day] = {
      Desayuno: null,
      Almuerzo: null,
      Cena: null,
    };
  }
  return plan;
}

function defaultNotificationPrefs(): NotificationPreferences {
  return {
    newRecipes: true,
    newVideos: true,
    premiumCollections: true,
    recommendedRecipes: true,
    crecisanoNews: true,
  };
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function createSeedUsers(): StoredUser[] {
  return [
    {
      id: 'user-demo-crecisano',
      name: 'Sofía Navarro',
      email: 'sofia@crecisano.com',
      passwordHash: hashPassword('crecisano123'),
      membershipStatus: 'free',
      preferences: ['Recetas saludables', 'Recetas rápidas'],
      pantry: ['Pollo', 'Papa', 'Zanahoria', 'Arroz', 'Aguacate', 'Huevo'],
      recipeHistory: ['arroz-pollo-papa-zanahoria', 'tostadas-palta-huevo'],
      notificationPrefs: defaultNotificationPrefs(),
      createdAt: '2026-10-15T10:00:00.000Z',
    },
    {
      id: 'user-premium-crecisano',
      name: 'Camila Mendoza (Premium)',
      email: 'camila@crecisano.com',
      passwordHash: hashPassword('premium123'),
      membershipStatus: 'premium_active',
      membershipExpiresAt: '2027-05-01T00:00:00.000Z',
      preferences: ['Recetas saludables', 'Desayunos', 'Cenas'],
      pantry: ['Quinoa', 'Camote', 'Salmón', 'Brócoli', 'Espinaca', 'Limón'],
      recipeHistory: ['bowl-quinoa-camote', 'salmon-hierbas-vegetales'],
      notificationPrefs: defaultNotificationPrefs(),
      createdAt: '2026-09-01T10:00:00.000Z',
    },
    {
      id: 'user-expired-crecisano',
      name: 'Andrés Herrera (Membresía vencida)',
      email: 'andres@crecisano.com',
      passwordHash: hashPassword('vencida123'),
      membershipStatus: 'premium_expired',
      membershipExpiresAt: '2026-09-15T00:00:00.000Z',
      preferences: ['Recetas económicas', 'Almuerzos'],
      pantry: ['Lentejas', 'Papa', 'Zanahoria', 'Tomate'],
      recipeHistory: ['guiso-lentejas-vegetales'],
      notificationPrefs: defaultNotificationPrefs(),
      createdAt: '2026-06-10T10:00:00.000Z',
    },
  ];
}

function createInitialNotifications(): AppNotification[] {
  return INITIAL_NOTIFICATIONS;
}

function createInitialDb(): DatabaseSchema {
  const seedUsers = createSeedUsers();
  const demoUserId = seedUsers[0].id;
  const premiumUserId = seedUsers[1].id;

  const demoPlan = createEmptyMealPlan();
  demoPlan.Lunes.Desayuno = 'tostadas-palta-huevo';
  demoPlan.Lunes.Almuerzo = 'arroz-pollo-papa-zanahoria';
  demoPlan.Martes.Desayuno = 'panqueques-avena-platano';
  demoPlan.Miércoles.Almuerzo = 'ensalada-mediterranea-garbanzos';

  const premiumPlan = createEmptyMealPlan();
  premiumPlan.Lunes.Desayuno = 'panqueques-integrales-miel';
  premiumPlan.Lunes.Almuerzo = 'bowl-quinoa-camote';
  premiumPlan.Martes.Cena = 'salmon-hierbas-vegetales';

  return {
    users: seedUsers,
    sessions: {},
    recipes: INITIAL_RECIPES,
    favorites: {
      [demoUserId]: ['arroz-pollo-papa-zanahoria', 'tostadas-palta-huevo'],
      [premiumUserId]: ['bowl-quinoa-camote', 'salmon-hierbas-vegetales'],
    },
    mealPlans: {
      [demoUserId]: demoPlan,
      [premiumUserId]: premiumPlan,
    },
    communityPosts: INITIAL_COMMUNITY_POSTS,
    notifications: INITIAL_NOTIFICATIONS,
  };
}

function loadDb(): DatabaseSchema {
  if (inMemoryDb) {
    return inMemoryDb;
  }
  let raw = '';
  try {
    if (fs.existsSync(DB_FILE)) {
      raw = fs.readFileSync(DB_FILE, 'utf-8');
    } else if (fs.existsSync(BUNDLED_DB_FILE)) {
      raw = fs.readFileSync(BUNDLED_DB_FILE, 'utf-8');
    }
  } catch (err) {
    console.warn('Unable to read disk database:', err);
  }

  if (raw) {
    try {
      const parsed = JSON.parse(raw) as DatabaseSchema;

      // Ensure all INITIAL_RECIPES exist and are up to date
      const existingIds = new Set(parsed.recipes.map((r) => r.id));
      for (const seedRecipe of INITIAL_RECIPES) {
        if (!existingIds.has(seedRecipe.id)) {
          parsed.recipes.push(seedRecipe);
        } else {
          const idx = parsed.recipes.findIndex((r) => r.id === seedRecipe.id);
          if (idx !== -1 && !parsed.recipes[idx].isCommunity) {
            parsed.recipes[idx] = seedRecipe;
          }
        }
      }

      // Ensure seed demo users exist
      const seedUsers = createSeedUsers();
      for (const su of seedUsers) {
        const existingUser = parsed.users.find((u) => u.email === su.email);
        if (!existingUser) {
          parsed.users.push(su);
        } else {
          if (!existingUser.membershipStatus) {
            existingUser.membershipStatus = su.membershipStatus;
          }
          if (!existingUser.notificationPrefs) {
            existingUser.notificationPrefs = defaultNotificationPrefs();
          }
          if (!existingUser.recipeHistory) {
            existingUser.recipeHistory = [];
          }
        }
      }

      if (!parsed.notifications || parsed.notifications.length === 0) {
        parsed.notifications = INITIAL_NOTIFICATIONS;
      }
      if (!parsed.communityPosts || parsed.communityPosts.length === 0) {
        parsed.communityPosts = INITIAL_COMMUNITY_POSTS;
      }

      inMemoryDb = parsed;
      return parsed;
    } catch {
      // Fall through to initial
    }
  }

  const initial = createInitialDb();
  inMemoryDb = initial;
  saveDb(initial);
  return initial;
}

function saveDb(db: DatabaseSchema): void {
  inMemoryDb = db;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Filesystem write failed (e.g. read-only serverless environment), keeping db in memory:', err);
  }
}

function sanitizeUser(user: StoredUser): UserProfile {
  const { passwordHash: _, ...profile } = user;
  return {
    ...profile,
    membershipStatus: profile.membershipStatus || 'free',
    recipeHistory: profile.recipeHistory || [],
    notificationPrefs: profile.notificationPrefs || defaultNotificationPrefs(),
  };
}

export const app = express();
app.use(express.json({ limit: '2mb' }));

export const apiRouter = express.Router();

function getAuthUser(req: express.Request, db: DatabaseSchema): StoredUser | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  const userId = db.sessions[token];
  if (!userId) return null;
  return db.users.find((u) => u.id === userId) || null;
}

  apiRouter.get('/health', (_req, res) => {
    res.json({ status: 'ok', app: 'CreciSano', sync: 'web-and-mobile-unified' });
  });

  // Auth: Register
  apiRouter.post('/auth/register', (req, res) => {
    const { name, email, password, preferences } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      preferences?: string[];
    };

    if (!name?.trim() || !email?.trim() || !password || password.length < 4) {
      res.status(400).json({
        error:
          'Por favor completa tu nombre, correo válido y una contraseña de al menos 4 caracteres.',
      });
      return;
    }

    const db = loadDb();
    const normalizedEmail = email.trim().toLowerCase();
    if (db.users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      res.status(409).json({
        error: 'Ya existe una cuenta registrada con este correo electrónico.',
      });
      return;
    }

    const newUser: StoredUser = {
      id: `user-${crypto.randomUUID().slice(0, 8)}`,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      membershipStatus: 'free',
      preferences: Array.isArray(preferences) ? preferences : ['Recetas saludables'],
      pantry: ['Pollo', 'Papa', 'Zanahoria', 'Arroz', 'Huevo'],
      recipeHistory: [],
      notificationPrefs: defaultNotificationPrefs(),
      createdAt: new Date().toISOString(),
    };

    const token = crypto.randomBytes(24).toString('hex');
    db.users.push(newUser);
    db.sessions[token] = newUser.id;
    db.favorites[newUser.id] = [];
    db.mealPlans[newUser.id] = createEmptyMealPlan();
    saveDb(db);

    res.status(201).json({
      token,
      user: sanitizeUser(newUser),
      favorites: [],
      mealPlan: db.mealPlans[newUser.id],
    });
  });

  // Auth: Login
  apiRouter.post('/auth/login', (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email?.trim() || !password) {
      res.status(400).json({ error: 'Ingresa tu correo electrónico y contraseña.' });
      return;
    }

    const db = loadDb();
    const normalizedEmail = email.trim().toLowerCase();
    const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user || user.passwordHash !== hashPassword(password)) {
      res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
      return;
    }

    const token = crypto.randomBytes(24).toString('hex');
    db.sessions[token] = user.id;
    if (!db.favorites[user.id]) db.favorites[user.id] = [];
    if (!db.mealPlans[user.id]) db.mealPlans[user.id] = createEmptyMealPlan();
    saveDb(db);

    res.json({
      token,
      user: sanitizeUser(user),
      favorites: db.favorites[user.id],
      mealPlan: db.mealPlans[user.id],
    });
  });

  // Auth: Password Recovery
  apiRouter.post('/auth/recover', (req, res) => {
    const { email, newPassword } = req.body as {
      email?: string;
      newPassword?: string;
    };
    if (!email?.trim() || !newPassword || newPassword.length < 4) {
      res.status(400).json({
        error:
          'Ingresa tu correo registrado y una nueva contraseña de al menos 4 caracteres.',
      });
      return;
    }

    const db = loadDb();
    const normalizedEmail = email.trim().toLowerCase();
    const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      res.status(404).json({
        error: 'No encontramos una cuenta asociada a ese correo electrónico.',
      });
      return;
    }

    user.passwordHash = hashPassword(newPassword);
    saveDb(db);

    res.json({
      message:
        'Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión.',
    });
  });

  // Auth: Current session
  apiRouter.get('/auth/me', (req, res) => {
    const db = loadDb();
    const user = getAuthUser(req, db);
    if (!user) {
      res.status(401).json({ error: 'Sesión no válida' });
      return;
    }
    res.json({
      user: sanitizeUser(user),
      favorites: db.favorites[user.id] || [],
      mealPlan: db.mealPlans[user.id] || createEmptyMealPlan(),
    });
  });

  // Profile update (name, avatarUrl, preferences, pantry, notificationPrefs)
  apiRouter.patch('/profile', (req, res) => {
    const db = loadDb();
    const user = getAuthUser(req, db);
    if (!user) {
      res.status(401).json({ error: 'Debes iniciar sesión para guardar tu perfil.' });
      return;
    }

    const { name, avatarUrl, preferences, pantry, notificationPrefs } = req.body as {
      name?: string;
      avatarUrl?: string;
      preferences?: string[];
      pantry?: string[];
      notificationPrefs?: NotificationPreferences;
    };

    if (typeof name === 'string' && name.trim().length > 0) {
      user.name = name.trim();
    }
    if (typeof avatarUrl === 'string') {
      user.avatarUrl = avatarUrl.trim();
    }
    if (Array.isArray(preferences)) {
      user.preferences = preferences;
    }
    if (Array.isArray(pantry)) {
      user.pantry = pantry;
    }
    if (notificationPrefs && typeof notificationPrefs === 'object') {
      user.notificationPrefs = {
        ...defaultNotificationPrefs(),
        ...user.notificationPrefs,
        ...notificationPrefs,
      };
    }

    saveDb(db);
    res.json({ user: sanitizeUser(user) });
  });

  // Profile: Record viewed recipe in history
  apiRouter.post('/profile/history', (req, res) => {
    const db = loadDb();
    const user = getAuthUser(req, db);
    if (!user) {
      res.status(200).json({ ok: true });
      return;
    }
    const { recipeId } = req.body as { recipeId?: string };
    if (recipeId) {
      const current = user.recipeHistory || [];
      user.recipeHistory = [
        recipeId,
        ...current.filter((id) => id !== recipeId),
      ].slice(0, 20);
      saveDb(db);
    }
    res.json({ recipeHistory: user.recipeHistory });
  });

  // Subscription & Payment Gateway Preparation (No simulated payments!)
  apiRouter.get('/subscription/config', (_req, res) => {
    res.json({
      plans: [
        {
          id: 'monthly',
          name: 'Plan Mensual CreciSano Premium',
          price: Number(process.env.PREMIUM_MONTHLY_PRICE) || 6.99,
          currency: 'USD',
          durationLabel: '1 mes · Renovación mensual',
        },
        {
          id: 'annual',
          name: 'Plan Anual CreciSano Premium',
          price: Number(process.env.PREMIUM_ANNUAL_PRICE) || 59.99,
          currency: 'USD',
          durationLabel: '12 meses · Ahorra 28%',
        },
      ],
      gatewayConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
    });
  });

  apiRouter.post('/subscription/checkout', (req, res) => {
    const db = loadDb();
    const user = getAuthUser(req, db);
    if (!user) {
      res.status(401).json({
        error: 'Inicia sesión o crea una cuenta antes de suscribirte a CreciSano Premium.',
      });
      return;
    }

    const { planId } = req.body as { planId?: string };
    if (!process.env.STRIPE_SECRET_KEY) {
      res.status(503).json({
        configured: false,
        error:
          'La pasarela de pagos (Stripe) está preparada para integración. Configura STRIPE_SECRET_KEY en el servidor para habilitar el cobro real de suscripciones. No se realizan cobros ni activaciones simuladas.',
      });
      return;
    }

    res.json({
      configured: true,
      planId: planId || 'monthly',
      checkoutUrl: `${process.env.APP_URL || ''}/checkout?plan=${planId || 'monthly'}`,
    });
  });

  // Notifications
  apiRouter.get('/notifications', (_req, res) => {
    const db = loadDb();
    res.json({ notifications: db.notifications });
  });

  apiRouter.post('/notifications/read-all', (_req, res) => {
    const db = loadDb();
    db.notifications = db.notifications.map((n) => ({ ...n, read: true }));
    saveDb(db);
    res.json({ notifications: db.notifications });
  });

  // Recipes: List all
  apiRouter.get('/recipes', (_req, res) => {
    const db = loadDb();
    res.json({ recipes: db.recipes });
  });

  // Recipes: Create new recipe (and optionally post to community)
  apiRouter.post('/recipes', (req, res) => {
    const db = loadDb();
    const user = getAuthUser(req, db);
    const body = req.body as Partial<Recipe> & { story?: string };

    if (
      !body.title?.trim() ||
      !Array.isArray(body.ingredients) ||
      body.ingredients.length === 0
    ) {
      res.status(400).json({
        error: 'La receta debe incluir un título y al menos un ingrediente.',
      });
      return;
    }

    const newRecipe: Recipe = {
      id: `rec-${crypto.randomUUID().slice(0, 8)}`,
      title: body.title.trim(),
      description:
        body.description?.trim() ||
        'Receta casera compartida en la comunidad de CreciSano.',
      image:
        body.image || '/src/assets/images/recipe_quinoa_bowl_1793832461748.jpg',
      prepTimeMinutes: Number(body.prepTimeMinutes) || 20,
      difficulty: body.difficulty || 'Fácil',
      servings: Number(body.servings) || 2,
      categories:
        Array.isArray(body.categories) && body.categories.length > 0
          ? body.categories
          : ['Recetas saludables'],
      ingredients: body.ingredients,
      steps:
        Array.isArray(body.steps) && body.steps.length > 0
          ? body.steps
          : [
              'Prepara los ingredientes y cocina a fuego medio hasta integrar los sabores.',
            ],
      nutrition: body.nutrition || {
        calories: 350,
        protein: '14 g',
        carbs: '40 g',
        fats: '12 g',
      },
      isNew: true,
      authorName: user?.name || body.authorName || 'Miembro CreciSano',
      isCommunity: true,
    };

    db.recipes.unshift(newRecipe);

    const newPost: CommunityPost = {
      id: `post-${crypto.randomUUID().slice(0, 8)}`,
      recipeId: newRecipe.id,
      authorName: newRecipe.authorName || 'Miembro CreciSano',
      title: newRecipe.title,
      story: body.story?.trim() || newRecipe.description,
      image: newRecipe.image,
      category: newRecipe.categories[0],
      prepTimeMinutes: newRecipe.prepTimeMinutes,
      likes: 1,
      likedBy: user ? [user.id] : [],
      comments: [],
      createdAt: new Date().toISOString(),
    };

    db.communityPosts.unshift(newPost);
    saveDb(db);

    res.status(201).json({ recipe: newRecipe, post: newPost });
  });

  // Favorites: Toggle
  apiRouter.post('/favorites/toggle', (req, res) => {
    const db = loadDb();
    const user = getAuthUser(req, db);
    if (!user) {
      res.status(401).json({
        error: 'Inicia sesión para guardar tus recetas favoritas.',
      });
      return;
    }

    const { recipeId } = req.body as { recipeId?: string };
    if (!recipeId) {
      res.status(400).json({ error: 'Falta el identificador de la receta.' });
      return;
    }

    const current = db.favorites[user.id] || [];
    const exists = current.includes(recipeId);
    const updated = exists
      ? current.filter((id) => id !== recipeId)
      : [...current, recipeId];

    db.favorites[user.id] = updated;
    saveDb(db);

    res.json({ favorites: updated, isFavorite: !exists });
  });

  // Meal Plan: Update slot
  apiRouter.put('/meal-plan', (req, res) => {
    const db = loadDb();
    const user = getAuthUser(req, db);
    if (!user) {
      res.status(401).json({
        error: 'Inicia sesión para guardar tu menú semanal.',
      });
      return;
    }

    const { day, slot, recipeId } = req.body as {
      day?: DayOfWeek;
      slot?: MealSlot;
      recipeId?: string | null;
    };

    if (!day || !slot) {
      res.status(400).json({ error: 'Día y comida son obligatorios.' });
      return;
    }

    if (!db.mealPlans[user.id]) {
      db.mealPlans[user.id] = createEmptyMealPlan();
    }

    db.mealPlans[user.id][day][slot] = recipeId ?? null;
    saveDb(db);

    res.json({ mealPlan: db.mealPlans[user.id] });
  });

  // Community: Get posts
  apiRouter.get('/community', (_req, res) => {
    const db = loadDb();
    res.json({ posts: db.communityPosts });
  });

  // Community: Like post
  apiRouter.post('/community/:postId/like', (req, res) => {
    const db = loadDb();
    const user = getAuthUser(req, db);
    const post = db.communityPosts.find((p) => p.id === req.params.postId);
    if (!post) {
      res.status(404).json({ error: 'Publicación no encontrada.' });
      return;
    }

    const actorId = user?.id || 'guest';
    if (post.likedBy.includes(actorId)) {
      post.likedBy = post.likedBy.filter((id) => id !== actorId);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(actorId);
      post.likes += 1;
    }

    saveDb(db);
    res.json({ post });
  });

  // Community: Add comment
  apiRouter.post('/community/:postId/comment', (req, res) => {
    const db = loadDb();
    const user = getAuthUser(req, db);
    const post = db.communityPosts.find((p) => p.id === req.params.postId);
    if (!post) {
      res.status(404).json({ error: 'Publicación no encontrada.' });
      return;
    }

    const { text } = req.body as { text?: string };
    if (!text?.trim()) {
      res.status(400).json({ error: 'Escribe un comentario antes de enviar.' });
      return;
    }

    post.comments.push({
      id: `c-${crypto.randomUUID().slice(0, 8)}`,
      authorName: user?.name || 'Visitante CreciSano',
      text: text.trim(),
      createdAt: new Date().toISOString(),
    });

    saveDb(db);
    res.json({ post });
  });

  app.use('/api', apiRouter);
  app.use(apiRouter);

export async function startServer() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`CreciSano server running on http://localhost:${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
