import * as vscode from "vscode";
import { commandSetup, selectMCAPFile } from "../utils";

/**
 * Registers the `mcap-cli-vscode.add` command, which prompts the user to select an MCAP file and then
 * runs the "add" command with the selected file path and the options to add an attachment or metadata.
  * @param uri The URI of the file to view. If not provided, the user will be prompted to select a file.
 */
export default vscode.commands.registerCommand(
  "mcap-cli-vscode.add",
  async (uri: vscode.Uri) => {
    const filePath = await selectMCAPFile(
      uri && uri.fsPath !== "" ? uri.fsPath : ""
    );
    if (!filePath) {
      console.log("No file selected or found.");
      return;
    }
    await commandSetup(
      "add",
      [
        { command: "attachment", description: "Add an attachment to an MCAP file"},
        { command: "metadata", description: "Add metadata to an MCAP file" },
      ],
      [filePath],
      false
    );
  }
);
