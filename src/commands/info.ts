import * as vscode from "vscode";
import { commandSetup, runMCAPCommand, selectMCAPFile } from "../utils";

/**
 * Registers the `mcap-cli-vscode.info` command, which allows the user to read statistics on an mcap file.
 * @param uri The URI of the file to get info of, if specified through the explorers/context menu.
 */
export default vscode.commands.registerCommand(
  "mcap-cli-vscode.info",
  async (uri: vscode.Uri) => {
    const filePath = await selectMCAPFile(
      uri && uri.fsPath !== "" ? uri.fsPath : ""
    );

    if (!filePath) {
      console.log("No file selected or found.");
      return;
    }

    await runMCAPCommand(["info"], [filePath], [""]);
  }
);
