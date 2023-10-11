import * as vscode from "vscode";
import commands from "./commands";
import { showInputBox } from "./utils";

/**
 * Initializes the extension by checking if the MCAP binary is present in the configuration settings,
 * and updating the configuration with the path to the binary if found in the workspace. 
 * The user will be prompted to resolve the path if the binary is not found in either.
 * @returns A Promise that resolves to a boolean indicating whether the initialization was successful.
 */
async function extentionInit(): Promise<boolean> {
  try {
    if (vscode.workspace.getConfiguration().get("mcap.mcapPath")) {
      console.log("MCAP binary detected in workspace.");
      return true;
    } else {
      console.log("MCAP binary not detected.");

      console.log(
        "MCAP binary not detected. Searching for MCAP binary in workspace..."
      );

      const files = await vscode.workspace.findFiles("mcap(.exe)?");
      if (files.length > 0) {
        vscode.workspace
          .getConfiguration()
          .update(
            "mcap.mcapPath",
            files[0].fsPath,
            vscode.ConfigurationTarget.Global
          ) // Set the new value globally
          .then(() => {
            vscode.window.showInformationMessage(
              "Configuration value updated successfully!"
            );
          });
      } else {
        // If the MCAP binary is not found in the workspace, prompt the user to select the binary
        vscode.window
          .showErrorMessage("MCAP binary not detected.", "Update Path")
          .then(async () => {
            const fileUri = await vscode.window.showOpenDialog({
              openLabel: "Select MCAP binary",
            });
            if (fileUri) {
              vscode.workspace
                .getConfiguration()
                .update(
                  "mcap.mcapPath",
                  fileUri[0].fsPath,
                  vscode.ConfigurationTarget.Workspace
                ) // Set the new value in the workspace
                .then(() => {
                  vscode.window.showInformationMessage(
                    "Configuration value updated successfully!"
                  );
                });
            }
          });
      }
    }
  } catch (error) {
    vscode.window.showErrorMessage(`An error has occured: \n${error}`);
    return false;
  }
  return true;
}

// This method is called when the extension is activated
export function activate(context: vscode.ExtensionContext) {
  const extBinPath = extentionInit();
  extBinPath.then(
    (e) => {
      context.subscriptions.push(...commands);
    },
    (e) => {
      vscode.window.showErrorMessage(`An error has occured: \n${e}`);
      console.log(e);
    }
  );
}

// This method is called when the extension is deactivated
export function deactivate() {}
