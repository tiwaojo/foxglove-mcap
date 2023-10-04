import * as vscode from "vscode";
import { commandSetup, selectMCAPFile } from "../utils";

/**
 * Registers the 'mcap-cli-vscode.get' command with VS Code, which allows users to get an attachment or metadata from an MCAP file.
 * @param uri The URI of the file to get a record from, if specified through the explorers/context menu.
 */
export default vscode.commands.registerCommand(
  "mcap-cli-vscode.get",
  async (uri: vscode.Uri) => {
    const filePath = await selectMCAPFile(
      uri && uri.fsPath !== "" ? uri.fsPath : ""
    );
    if (!filePath) {
      console.log("No '.mcap' file selected or found.");
      return;
    }

    await commandSetup(
      "get",
      [
        {command: "attachment", description: "Get an attachment by name or offset"},
        {command: "metadata", description: "Get metadata by name"},
      ],
      [filePath],
      false
    );
  }
);
