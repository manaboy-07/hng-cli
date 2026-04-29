import http from "http";
import open from "open";
import ora from "ora";
import { saveTokens, BACKEND_URL } from "./utils.js";

const PORT = 4242;

export async function login() {
  const spinner = ora("Waiting for authentication...").start();

  const server = http.createServer((req, res) => {
    const url = new URL(req.url as any, `http://localhost:${PORT}`);

    if (url.pathname !== "/callback") {
      res.writeHead(404);
      return res.end();
    }

    const access_token = url.searchParams.get("access_token");

    if (!access_token) {
      console.log("No token received");
      return;
    }

    console.log("TOKEN RECEIVED");

    saveTokens({
      access_token,
      refresh_token: url.searchParams.get("refresh_token"),
    });

    spinner.succeed("Login successful!");

    res.end("Success. You can close this.");

    server.close();
    setTimeout(() => process.exit(0), 300);
  });
  server.listen(PORT, () => {
    const authUrl = `${BACKEND_URL}/auth/github?state=cli`;

    console.log("\nOpening browser...\n");

    open(authUrl);
  });
}
