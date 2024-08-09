import database from "infra/database.js";
import migrationRunner from "node-pg-migrate";
import { join } from "path";

async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(request.method)) {
    return response.status(405).end();
  }

  let dbClient;
  try {
    dbClient = await database.getNewDbClient();

    const defaultMigrationConfig = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationConfig);

      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const executedMigrations = await migrationRunner({
        ...defaultMigrationConfig,
        dryRun: false,
      });

      if (migrations.length > 0) {
        return response.status(201).json(executedMigrations);
      }

      return response.status(200).end();
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}

export default migrations;
