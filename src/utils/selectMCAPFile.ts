import * as vscode from "vscode";

/**
 * Executes a command with the selected file, or prompts the user to select an MCAP file if no file is selected.
 * @returns The file path of the selected file, or null if no file is selected.
 */
export async function selectMCAPFile(
  uri?: string,
  fileExt = ".mcap",
  selectMany = false
) {
  // if the file path is available through the explorer context menu, use it
  if (uri) {
    return uri;
  }

  const files = await vscode.workspace.findFiles(`**/*${fileExt}`);

  if (files.length === 0) {
    vscode.window.showInformationMessage(
      `No ${fileExt} files found in the workspace.`
    );
    return;
  }

  const fileItems = files.map((file) => ({
    label: file.path,
    description: file.fsPath,
  }));

  const selectedFiles = await vscode.window.showQuickPick(fileItems, {
    placeHolder: `Select a ${fileExt} file`,
    matchOnDetail: true,
    canPickMany: selectMany,
  });

  return selectedFiles?.label;
}
