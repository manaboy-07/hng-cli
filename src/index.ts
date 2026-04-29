#!/usr/bin/env node
import { Command } from "commander";
import api from "./api.js";
import { login } from "./auth.js";
import { clearTokens, getTokens } from "./utils.js";
import Table from "cli-table3";
import ora from "ora";
import fs from "fs";

const program = new Command();

program.name("insighta").description("Insighta Labs+ CLI").version("1.0.0");

program.command("login").action(login);

program.command("logout").action(async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    await clearTokens();
    console.log("Logged out successfully.");
  }
});

program.command("whoami").action(async () => {
  const tokens = await getTokens();
  if (!tokens) return console.log("Not logged in.");
  console.log(
    `Logged in as session: ${tokens.access_token.substring(0, 10)}...`,
  );
});

// PROFILE COMMANDS
program
  .command("profiles:list")
  .option("--gender <gender>", "Filter by gender")
  .option("--country <country>", "Filter by country (NG, US, etc)")
  .option("--age-group <group>", "adult, child, etc")
  .option("--min-age <age>", "Min age")
  .option("--max-age <age>", "Max age")
  .option("--sort-by <field>", "Sort field")
  .option("--order <order>", "asc or desc")
  .option("--page <num>", "Page number", "1")
  .option("--limit <num>", "Page limit", "10")
  .action(async (options) => {
    const spinner = ora("Loading profiles...").start();
    try {
      const { data } = await api.get("/api/profiles", { params: options });
      spinner.stop();

      const table = new Table({
        head: ["ID", "Name", "Gender", "Age", "Country"],
      });
      data.data.forEach((p: any) =>
        table.push([p.id.slice(0, 8), p.name, p.gender, p.age, p.country_id]),
      );

      console.log(table.toString());
      console.log(
        `Page: ${data.page}/${data.total_pages} | Total: ${data.total}`,
      );
    } catch (err: any) {
      spinner.fail(err.response?.data?.message || "Failed to fetch profiles");
    }
  });

program.command("profiles:get <id>").action(async (id) => {
  try {
    const { data } = await api.get(`/api/profiles/${id}`);
    console.log(data.data);
  } catch (err) {
    console.error("Profile not found");
  }
});

program.command("profiles:search <query>").action(async (query) => {
  const spinner = ora("Searching...").start();
  try {
    const { data } = await api.get("/api/profiles/search", {
      params: { q: query },
    });
    spinner.stop();
    const table = new Table({ head: ["Name", "Country", "Age"] });
    data.data.forEach((p: any) => table.push([p.name, p.country_id, p.age]));
    console.log(table.toString());
  } catch (err) {
    spinner.fail("Search failed");
  }
});

program
  .command("profiles:create")
  .requiredOption("--name <name>", "Profile name")
  .action(async (options) => {
    const spinner = ora("Creating profile...").start();
    try {
      const { data } = await api.post("/api/profiles", { name: options.name });
      spinner.succeed(`Created: ${data.data.name} (ID: ${data.data.id})`);
    } catch (err) {
      spinner.fail("Unauthorized or Error");
    }
  });

program
  .command("profiles:export")
  .option("--format <format>", "csv", "csv")
  .option("--gender <gender>", "Filter")
  .action(async (options) => {
    const spinner = ora("Exporting CSV...").start();
    try {
      const response = await api.get("/api/profiles/export", {
        params: options,
        responseType: "stream",
      });
      const filename = `profiles_${Date.now()}.csv`;
      const writer = fs.createWriteStream(filename);
      response.data.pipe(writer);
      writer.on("finish", () => spinner.succeed(`Exported to ${filename}`));
    } catch (err) {
      spinner.fail("Export failed");
    }
  });

program.parse(process.argv);
