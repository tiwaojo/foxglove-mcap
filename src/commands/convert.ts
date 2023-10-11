import * as vscode from "vscode";
import { showInputBox, runMCAPCommand, selectMCAPFile } from "../utils";

/**
 * Registers a command to convert a `.db3` bag file to the `.mcap` format.
 * @param uri The URI of the `.db3` bag file to convert, if specified through the explorers/context menu.
 */
export default vscode.commands.registerCommand(
  "mcap-cli-vscode.convert",
  async (uri: vscode.Uri) => {
    const filePath = await selectMCAPFile(
      uri && uri.fsPath !== "" ? uri.fsPath : "",
      ".db3"
    );
    if (!filePath) {
      console.log("No '.db3' file selected or found.");
      return;
    }

    /**
     * Obtains the output file name from the user.
     * @returns The output file name inputed as string.
     */
    const outFile = await showInputBox({
      placeHolder: "output file name. ex: output.mcap",
      title: "Output File",
      validateInput: (text: string) => {
        // determine the validation result matches *.mcap
        return !text.endsWith(".mcap")
          ? "The file name must end with '.mcap'"
          : null; // return null if validates
      },
    });

    /**
     * Obtains the flags from the user.
     * @returns The flags inputed as string.
     */
    const flags = await showInputBox();

    await runMCAPCommand(
      ["convert"],
      [filePath],
      [outFile || "out.mcap", flags || ""]
    );

    vscode.window.showInformationMessage("Success from mcap-cli convert");
  }
);
