import * as vscode from "vscode";
import { commandSetup, selectMCAPFile } from "../utils";

/**
 * Registers a command to filter MCAP files.
 * @param uri - The URI of the file to filter.
 */
export default vscode.commands.registerCommand(
  "mcap-cli-vscode.filter",
  async (uri: vscode.Uri) => {
    const filePath = await selectMCAPFile(
      uri && uri.fsPath !== "" ? uri.fsPath : ""
    );
    if (!filePath) {
      console.log("No file selected or found.");
      return;
    }

    await commandSetup("filter", [], [filePath], true);
  }
);
