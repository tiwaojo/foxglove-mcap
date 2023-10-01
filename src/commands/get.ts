import * as vscode from "vscode";
import {
  commandSetup,
  flagsInput,
  runMCAPCommand,
  selectMCAPFile,
} from "../utils";

export default vscode.commands.registerCommand(
  "mcap-cli-vscode.get",
  async (uri: vscode.Uri) => {
    const filePath = await selectMCAPFile(
      uri && uri.fsPath !== "" ? uri.fsPath : ""
    );
    if (!filePath) {
      vscode.window.showErrorMessage("No '.mcap' file selected or found.");
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

    vscode.window.showInformationMessage("Success from mcap-cli get");
  }
);
