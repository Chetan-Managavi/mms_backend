import { execSync } from "child_process";
import { chmodSync } from "fs";

if (process.env.VCAP_SERVICES) {
  const vcap = JSON.parse(process.env.VCAP_SERVICES);
  const pg = vcap['postgresql-db'][0].credentials;

  process.env.DATABASE_URL = `postgresql://${pg.username}:${pg.password}@${pg.hostname}:${pg.port}/${pg.dbname}?schema=public&sslmode=require`;
}

//  Ensure prisma CLI is executable
chmodSync('./node_modules/.bin/prisma', '755');

execSync('./node_modules/.bin/prisma migrate deploy', { stdio: 'inherit' });
