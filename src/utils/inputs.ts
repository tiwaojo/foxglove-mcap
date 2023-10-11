import * as vscode from "vscode";

/**
 * Displays an input box for the user to enter optional flags with their respective arguments.
 * @param options Optional input box options.
 * @returns A promise that resolves to the string value entered by the user, or undefined if the user cancels the input.
 * @default 
 * ```json
 * {
    "prompt": "Insert optional flags here with their respective arguments",
    "placeHolder": "--end-secs=9223372036854775807 --topics=/imu/data,/gps",
    "ignoreFocusOut": false,
    }
    ```
 */
export const showInputBox = async (options?: vscode.InputBoxOptions) => {
  return await vscode.window.showInputBox(
    options || {
      prompt: "Insert optional flags here with their respective arguments",
      placeHolder: "--end-secs=9223372036854775807 --topics=/imu/data,/gps",
      ignoreFocusOut: true,
      title: "Flags",
    }
  );
};

/**
 * Displays a quick pick menu with the given sub-command items and returns the selected item.
 * @param subCmdItems - An array of objects containing label and description for each sub-command item.
 * @param cmd - The main command for which the sub-commands are being displayed.
 * @returns The selected sub-command item or null if no sub-commands are found.
 */
export async function showQuickPick(
  subCmdItems: { label: string; description: string }[],
  cmd: string
) {
  if (subCmdItems.length !== 0) {
    return await vscode.window.showQuickPick(subCmdItems, {
      matchOnDetail: true,
      canPickMany: false,
      placeHolder: "attachment",
      title: cmd,
      ignoreFocusOut: true,
    });
  }

  vscode.window.showErrorMessage(`No sub-commands found for ${cmd}`);
  return null;
}
