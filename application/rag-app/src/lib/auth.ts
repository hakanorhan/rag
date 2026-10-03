import "server-only";

import { connection } from "next/server";

export async function loadAuthConfig() {
  await connection();
  return import("./authConfig");
}
