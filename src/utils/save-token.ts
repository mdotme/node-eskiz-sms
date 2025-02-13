import * as fs from "fs";
import * as path from "path";

export function saveToken(token: string, envFile: string, key: string) {
  const envFilePath = path.resolve(envFile);
  const envFileContent = fs.existsSync(envFilePath)
    ? fs.readFileSync(envFilePath, "utf-8")
    : "";
  const envVars = envFileContent
    .split("\n")
    .filter((line) => line.trim() !== "");

  const newEnvVars = envVars.filter((line) => !line.startsWith(`${key}=`));
  newEnvVars.push(`${key}="${token}"`);

  fs.writeFileSync(envFilePath, newEnvVars.join("\n"));
}
