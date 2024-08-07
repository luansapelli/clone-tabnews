import { Client } from "pg";
import { env } from "process";

async function getNewDbClient() {
  const dbClient = new Client({
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
    database: env.POSTGRES_DB,
    password: env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  await dbClient.connect();
  return dbClient;
}

async function query(queryObject) {
  let dbClient;

  try {
    dbClient = await getNewDbClient();
    const result = await dbClient.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}

export default {
  getNewDbClient,
  query,
};

function getSSLValues() {
  if (env.POSTGRES_CA) {
    return {
      ca: env.POSTGRES_CA,
    };
  }

  return env.NODE_ENV === "production" ? true : false;
}
