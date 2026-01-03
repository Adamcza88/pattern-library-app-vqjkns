import { createApplication } from "@specific-dev/framework";
import * as schema from './db/schema.js';

// Import route registration functions
import * as patternsRoutes from './routes/patterns.js';
import * as masteryRoutes from './routes/mastery.js';
import * as quizRoutes from './routes/quiz.js';
import * as practiceRoutes from './routes/practice.js';
import * as seedRoutes from './routes/seed.js';

// Create application with schema for full database type support
export const app = await createApplication(schema);

// Export App type for use in route files
export type App = typeof app;

// Register all route modules
patternsRoutes.register(app, app.fastify);
masteryRoutes.register(app, app.fastify);
quizRoutes.register(app, app.fastify);
practiceRoutes.register(app, app.fastify);
seedRoutes.register(app, app.fastify);

await app.run();
app.logger.info('Application running');
