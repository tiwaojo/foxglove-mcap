import * as vscode from "vscode";
import { commandSetup, selectMCAPFile } from "../utils";

export default vscode.commands.registerCommand(
  "mcap-cli-vscode.add",
  async (uri: vscode.Uri) => {
    const filePath = await selectMCAPFile(
      uri && uri.fsPath !== "" ? uri.fsPath : ""
    );
    if (!filePath) {
      vscode.window.showErrorMessage("No file selected or found.");
      return;
    }
    await commandSetup(
      "add",
      [
        {
          command: "attachment",
          description: "Add an attachment to an MCAP file",
        },
        { command: "metadata", description: "Add metadata to an MCAP file" },
      ],
      [filePath],
      false
    );
  }
);
