import * as vscode from "vscode";
import { runMCAPCommand, selectMCAPFile } from "../utils";

/**
 Registers the `mcap-cli-vscode.doctor` command with VS Code, which allows the user to verify the structure of an MCAP file.
 * @param uri The URI of the file to which the structure is checked, if specified through the explorers/context menu.
 */
export default vscode.commands.registerCommand(
  "mcap-cli-vscode.doctor",
  async (uri: vscode.Uri) => {
    const filePath = await selectMCAPFile(
      uri && uri.fsPath !== "" ? uri.fsPath : ""
    );
    if (!filePath) {
      console.log("No '.mcap' file selected or found.");
      return;
    }

    await runMCAPCommand(["doctor"], [filePath], []);
  }
);
