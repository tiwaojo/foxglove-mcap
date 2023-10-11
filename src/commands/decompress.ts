import * as vscode from "vscode";
import { commandSetup, selectMCAPFile } from "../utils";

/**
 * Registers the `mcap-cli-vscode.decompress` command that prompts the user to select an `.mcap` file to decompress.
 * @param uri The URI of the mcap file to decompress, if specified through the explorers/context menu.
 */
export default vscode.commands.registerCommand(
  "mcap-cli-vscode.decompress",
  async (uri: vscode.Uri) => {
    const filePath = await selectMCAPFile(
      uri && uri.fsPath !== "" ? uri.fsPath : ""
    );
    if (!filePath) {
      console.log("No '.mcap' file selected or found.");
      return;
    }

    await commandSetup("decompress", [], [filePath], true);
  }
);
