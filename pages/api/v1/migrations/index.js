import database from "infra/database.js";
import migrationRunner from "node-pg-migrate";
import { join } from "path";

async function migrations(request, response) {
  const dbClient = await database.getNewDbClient();

  console.log("test preview deployment");

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

    await dbClient.end();

    return response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const executedMigrations = await migrationRunner({
      ...defaultMigrationConfig,
      dryRun: false,
    });

    await dbClient.end();

    if (migrations.length > 0) {
      return response.status(201).json(executedMigrations);
    }

    return response.status(200).end();
  }

  await dbClient.end();

  return response.status(405).end();
}

export default migrations;
