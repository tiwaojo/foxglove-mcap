import * as vscode from "vscode";
import {
  commandSetup,
  flagsInput,
  runMCAPCommand,
  selectMCAPFile,
} from "../utils";

export default vscode.commands.registerCommand(
  "mcap-cli-vscode.decompress",
  async (uri: vscode.Uri) => {
    const filePath = await selectMCAPFile(
      uri && uri.fsPath !== "" ? uri.fsPath : ""
    );
    if (!filePath) {
      vscode.window.showErrorMessage("No '.mcap' file selected or found.");
      return;
    }

    await commandSetup("decompress", [], [filePath], true);

    // const mcapFlags = (await flagsInput()) ?? "";

    // await runMCAPCommand(["filter"], [filePath], [mcapFlags]);
    vscode.window.showInformationMessage("Success from mcap-cli decompress");
  }
);
