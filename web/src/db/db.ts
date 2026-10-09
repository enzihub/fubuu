import { neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Local development: point the Neon HTTP driver at a local proxy in front of
// Postgres (see src/db/docker-compose.yml). Unset in deployed environments.
if (process.env.LOCAL_DB_HTTP_ENDPOINT) {
  neonConfig.fetchEndpoint = () => process.env.LOCAL_DB_HTTP_ENDPOINT!;
}

export const db = drizzle(process.env.DATABASE_URL!);
