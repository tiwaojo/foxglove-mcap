import * as vscode from "vscode";
import { commandSetup, runMCAPCommand, selectMCAPFile } from "../utils";

export default vscode.commands.registerCommand(
  "mcap-cli-vscode.info",
  async (uri: vscode.Uri) => {
    const filePath = await selectMCAPFile(
      uri && uri.fsPath !== "" ? uri.fsPath : ""
    );

    if (!filePath) {
      vscode.window.showErrorMessage("No file selected or found.");
      return;
    }

    await runMCAPCommand(["info"], [filePath], [""]);

    vscode.window.showInformationMessage("Success from mcap-cli info");
  }
);
