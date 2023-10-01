import * as vscode from "vscode";

/**
 * Displays an input box for the user to enter optional flags with their respective arguments.
 * @param options Optional input box options.
 * @returns A promise that resolves to the string value entered by the user, or undefined if the user cancels the input.
 * @default 
 * {
    prompt: "Insert optional flags here with their respective arguments";
    placeHolder: "--end-secs=9223372036854775807 --topics=/imu/data,/gps";
    ignoreFocusOut: false;
    }
 */
export const flagsInput = async (options?: vscode.InputBoxOptions) => {
  return await vscode.window.showInputBox(
    options || {
      prompt: "Insert optional flags here with their respective arguments",
      placeHolder: "--end-secs=9223372036854775807 --topics=/imu/data,/gps",
      ignoreFocusOut: true,
      title: "Flags",
    }
  );
};

export async function subCmdInput(
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
