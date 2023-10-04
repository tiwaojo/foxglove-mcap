import * as vscode from "vscode";
import { commandSetup, selectMCAPFile } from "../utils";

/**
 * Registers the `mcap-cli-vscode.list` command, which lists various information about an MCAP file.
 * @param uri The URI of the file to list information for. If specified through the explorers/context menu.
 * 
 */
export default vscode.commands.registerCommand(
  "mcap-cli-vscode.list",
  async (uri: vscode.Uri) => {
    const filePath = await selectMCAPFile(
      uri && uri.fsPath !== "" ? uri.fsPath : ""
    );
    if (!filePath) {
      console.log("No '.mcap' file selected or found.");
      return;
    }

    await commandSetup(
      "list",
      [
        { command: "attachment",description: "List attachments in an MCAP file"},
        { command: "channels", description: "List channels in an MCAP file" },
        { command: "chunks", description: "List chunks in an MCAP file" },
        { command: "metadata", description: "List metadata in an MCAP file" },
        { command: "schemas", description: "List schemas in an MCAP file" },
      ],
      [filePath],
      false
    );
  }
);
