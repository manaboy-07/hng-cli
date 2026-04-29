import fs from "fs-extra";
import path from "path";
import os from "os";

const CONFIG_DIR = path.join(os.homedir(), ".insighta");
const TOKEN_PATH = path.join(CONFIG_DIR, "credentials.json");

export const BACKEND_URL = "https://hng1-production-f8e7.up.railway.app";

export async function saveTokens(tokens: any) {
  await fs.ensureDir(CONFIG_DIR);
  await fs.writeJson(TOKEN_PATH, tokens);
}

export async function getTokens() {
  if (await fs.pathExists(TOKEN_PATH)) {
    return await fs.readJson(TOKEN_PATH);
  }
  return null;
}

export async function clearTokens() {
  if (await fs.pathExists(TOKEN_PATH)) {
    await fs.remove(TOKEN_PATH);
  }
}
