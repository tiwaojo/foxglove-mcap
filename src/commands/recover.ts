import * as vscode from "vscode";
import {
  commandSetup,
  selectMCAPFile,
} from "../utils";

/**
 * Registers the `mcap-cli-vscode.recover` command with VS Code, which allows the user to recover a previously saved MCAP file.
 * @param uri The URI of the file to recover, if specified through the explorers/context menu.
 */
export default vscode.commands.registerCommand(
  "mcap-cli-vscode.recover",
  async (uri: vscode.Uri) => {
    const filePath = await selectMCAPFile(
      uri && uri.fsPath !== "" ? uri.fsPath : ""
    );
    if (!filePath) {
      console.log("No '.mcap' file selected or found.");
      return;
    }

    await commandSetup("recover", [], [filePath], true);
  }
);
