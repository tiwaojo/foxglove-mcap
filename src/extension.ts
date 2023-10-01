// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Disposable } from "vscode";
import { commandSetup } from "./utils/commandSetup";
import commands from "./commands";

// export const config = vscode.workspace.getConfiguration(); // get configuration

// Get the properties saved in vscode config settings
function extentionInit(): boolean {
  try {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (
      !workspaceFolders ||
      workspaceFolders.length === 0 ||
      !vscode.workspace.getConfiguration().get("mcap.mcapPath")
    ) {
      vscode.window.showErrorMessage("MCAP binary not detected in workspace.");
      return false;
    }

    // checks if a mcapPath is set in the vscode settings

    const rootPath = workspaceFolders[0].uri.fsPath;

    vscode.workspace
      .getConfiguration()
      .update("mcap.mcapPath", rootPath, vscode.ConfigurationTarget.Global) // Set the new value globally
      .then(() => {
        vscode.window.showInformationMessage(
          "Configuration value updated successfully!"
        );
      });
  } catch (error) {
    vscode.window.showErrorMessage(`An error has occured: \n${error}`);
    return false;
  }
  return true;
}

export function activate(context: vscode.ExtensionContext) {
  if (extentionInit() !== true) {
  	return;
    }
  //   console.log("MCAP path: ", config.get("mcap.mcapPath"));
  //   console.log(
  //     'Congratulations, your extension "mcap-cli-vscode" is now active!'
  //   );

  context.subscriptions.push(...commands);
}

// This method is called when your extension is deactivated
export function deactivate() {}
