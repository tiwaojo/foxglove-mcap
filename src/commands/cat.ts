import * as vscode from "vscode";
import {
  commandSetup,
  showInputBox,
  runMCAPCommand,
  selectMCAPFile,
} from "../utils";

/**
 * Registers the `mcap-cli-vscode.cat` command, which allows the user to view the contents of a file using the MCAP CLI in stdout.
 * @param uri The URI of the file to view. If not provided, the user will be prompted to select a file.
 */
export default vscode.commands.registerCommand(
  "mcap-cli-vscode.cat",
  async (uri: vscode.Uri) => {
    const filePath = await selectMCAPFile(
      uri && uri.fsPath !== "" ? uri.fsPath : ""
    );
    if (!filePath) {
      console.log("No file selected or found.");
      return;
    }

    const mcapFlags = (await showInputBox()) ?? "";

    await runMCAPCommand(["cat"], [filePath], [mcapFlags]);

    vscode.window.showInformationMessage("Success from mcap-cli cat");
  }
);
