import * as vscode from "vscode";
import { commandSetup, selectMCAPFile } from "../utils";

/**
 * Registers a command to compress a file using MCAP CLI.
 * @param uri - The URI of the file to compress, if specified through the explorers/context menu.
 */
export default vscode.commands.registerCommand(
  "mcap-cli-vscode.compress",
  async (uri: vscode.Uri) => {
    const filePath = await selectMCAPFile(
      uri && uri.fsPath !== "" ? uri.fsPath : ""
    );
    if (!filePath) {
      console.log("No file selected or found.");
      return;
    }

    await commandSetup("compress", [], [filePath], true);
  }
);
