import * as vscode from "vscode";
import {
  commandSetup,
  flagsInput,
  runMCAPCommand,
  selectMCAPFile,
} from "../utils";

export default vscode.commands.registerCommand(
  "mcap-cli-vscode.list",
  async (uri: vscode.Uri) => {
    const filePath = await selectMCAPFile(
      uri && uri.fsPath !== "" ? uri.fsPath : ""
    );
    if (!filePath) {
      vscode.window.showErrorMessage("No '.mcap' file selected or found.");
      return;
    }

    await commandSetup("list", [
          {
            command: "attachment",
            description: "List attachments in an MCAP file",
          },
          { command: "channels", description: "List channels in an MCAP file" },
          { command: "chunks", description: "List chunks in an MCAP file" },
          { command: "metadata", description: "List metadata in an MCAP file" },
          { command: "schemas", description: "List schemas in an MCAP file" },
        ],[filePath], false);

    vscode.window.showInformationMessage("Success from mcap-cli list");
  }
);
