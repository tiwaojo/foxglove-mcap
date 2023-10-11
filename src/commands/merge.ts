import * as vscode from "vscode";
import { showInputBox, runMCAPCommand } from "../utils";

/**
 * Registers the `mcap-cli-vscode.merge` command with VS Code, which allows the user to merge MCAP files.
 */
export default vscode.commands.registerCommand(
  "mcap-cli-vscode.merge",
  async () => {
    /**
     * The flags to pass to the MCAP command.
     */
    let mcapFlags = (await showInputBox()) ?? "";

    if (!mcapFlags?.match(/^-o|--output$/)) {
      await showInputBox({
        prompt: "output file name. ex: output.mcap",
        title: "Output File",
        ignoreFocusOut: false,
        validateInput: (input: string) => {
          if (!input.endsWith(".mcap")) {
            return "The file name must end with '.mcap'";
          }
          return null;
        },
      }).then(
        (e) => {
          mcapFlags += ` -o ${e}`;
        },
        (e) => {
          console.log(e);
        }
      );
    }

    const files = await vscode.workspace.findFiles("**/*.mcap");

    if (files.length === 0) {
      vscode.window.showInformationMessage(
        "No .mcap files found in the workspace."
      );
      return;
    }

    const fileItems = files.map((file) => ({
      label: file.path,
      description: file.fsPath,
    }));

    /**
     * The selected files to merge.
     */
    const selectedFiles = await vscode.window
      .showQuickPick(fileItems, {
        placeHolder: "Select a .mcap file",
        matchOnDetail: true,
        canPickMany: true,
        ignoreFocusOut: true,
      })
      .then((e) => {
        return e?.map((e) => e.label);
      });

    await runMCAPCommand(["merge"], selectedFiles as string[], [mcapFlags]);
  }
);
