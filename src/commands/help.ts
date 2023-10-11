import * as vscode from "vscode";
import { runMCAPCommand } from "../utils";

/**
 * Registers the `mcap-cli-vscode.help` command with VS Code, which provides help for the mcap cli.
 */
export default vscode.commands.registerCommand(
  "mcap-cli-vscode.help",
  async () => {
    await runMCAPCommand(["help"], [], []);
  }
);
