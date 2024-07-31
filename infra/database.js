import { Client } from "pg";
import { env } from "process";

async function query(queryObject) {
  const client = new Client({
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
    database: env.POSTGRES_DB,
    password: env.POSTGRES_PASSWORD,
  });

  await client.connect();

  const result = await client.query(queryObject);

  await client.end();

  return result;
}

export default {
  query: query,
};
