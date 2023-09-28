// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { MCAPCommand } from "./types";

const config = vscode.workspace.getConfiguration(); // get configuration

async function executeCommandWithSelectedFile() {
  const activeEditor = vscode.window.activeTextEditor;

  if (!activeEditor) {
    vscode.window.showErrorMessage("No file selected.");
    return;
  }

  const filePath = activeEditor.document.uri.fsPath;
  console.log("Selected FILE PATH: ", activeEditor.document.uri);
  
  console.log("Selected FILE PATH: ", filePath);
  return filePath;
}

// Get the properties saved in vscode config settings
function extentionInit(): boolean {
  try {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (
      !workspaceFolders ||
      workspaceFolders.length === 0 ||
      !config.get("mcap.mcapPath")
    ) {
      vscode.window.showErrorMessage("MCAP binary not detected in workspace.");
      return false;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;

    config
      .update("mcap.mcapPath", rootPath, vscode.ConfigurationTarget.Global) // Set the new value globally
      .then(() => {
        vscode.window.showInformationMessage(
          "Configuration value updated successfully!"
        );
      });
  } catch (error) {
    vscode.window.showErrorMessage("An error has occured");
    return false;
  }
  return true;
}

// Prepares a terminal and executes the composed mcap command
async function runMCAP(
  mcapCommands: string[],
  mcapFlags: string[],
  files: string[]
) {
  const mcapClearOutputConf = vscode.workspace
    .getConfiguration()
    .get("mcap.clearOutputBeforeCommand");

  const terminalName = "MCAP Output";

  // Find if our terminal exists so it can be reused
  const terminal = vscode.window.terminals.find(
    (terminal) => terminal.name === terminalName
  );

  // Compose mcap command that will be used in the terminal
  const mcapCommand = `${config.get("mcap.mcapPath")} ${mcapCommands.join(
    " "
  )} ${mcapFlags.join(" ")} ${files.join(" ")}`;
  console.log("MCAP COMMAND: ", mcapCommand);

  if (mcapClearOutputConf) {
    await vscode.commands.executeCommand("workbench.action.terminal.clear");
  }

  if (terminal) {
    terminal.show(false);
    terminal.sendText(mcapCommand, true);
  } else {
    const mcapTerminal = vscode.window.createTerminal(terminalName);
    mcapTerminal.show(false);
    mcapTerminal.sendText(mcapCommand);
  }
}

// async function runMCAP(mcapCommands: string[], mcapFlags: string[], files: string[]) {
//     const mcapClearOutputConf = config.get("mcap.clearOutputBeforeCommand");

// 	// Find if our terminal exists so it can be reused
//     const terminalName = "MCAP Output";
//     const terminal = vscode.window.terminals.find((terminal) => terminal.name === terminalName) || vscode.window.createTerminal(terminalName);

//     const mcapCommand = `${config.get("mcap.mcapPath")} ${mcapCommands.join(" ")} ${mcapFlags.join(" ")} ${files.join(" ")}`;

//     if (mcapClearOutputConf) {
//         await vscode.commands.executeCommand("workbench.action.terminal.clear");
//     }

//     terminal.show(false);
//     terminal.sendText(mcapCommand, true);
// }

// Prepare a quick pick of .mcap files in the workspace
async function selectMCAPFile() {
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

  const selectedFiles = await vscode.window.showQuickPick(fileItems, {
    placeHolder: "Select a .mcap file",
    matchOnDetail: true,
  });

  return selectedFiles?.label;
}

// Prepare commands
async function commandSetup(
  cmd: string,
  subCmds: MCAPCommand[],
  reqSubCmd: boolean
) {
  const subCmdItems = subCmds.map((e) => ({
    label: e.command,
    description: e.description,
  }));

  // If the command requires a sub-command, but no sub-commands are found, show an error message
  if (subCmdItems.length > 0 && reqSubCmd) {
    vscode.window.showErrorMessage(
      `No sub-commands found for ${cmd}. Sub-commands are required for this command.`
    );
    const selectedSubCmd = await vscode.window.showQuickPick(subCmdItems, {
      matchOnDetail: true,
      canPickMany: false,
      placeHolder: "attachment",
      title: cmd,
    });

    /**
     * Executes a command with the selected file, or prompts the user to select an MCAP file if no file is selected.
     * @returns The file path of the selected file, or null if no file is selected.
     */
    const filePath =
      (await executeCommandWithSelectedFile()) ?? (await selectMCAPFile());

    if (!filePath || !selectedSubCmd) {
      return;
    }
    const flagsInput = await vscode.window.showInputBox({
      prompt: "Insert optional flags here with their respective arguments",
      placeHolder: "--end-secs=9223372036854775807 --topics=/imu/data,/gps",
      ignoreFocusOut: false,valueSelection: [0, 0]
    });
    runMCAP([cmd, selectedSubCmd?.label || ""], [flagsInput || ""], [filePath]);
  } else if (subCmdItems.length === 0 && !reqSubCmd) {
	// if there are no subcommands and they are not required, run the command
    /**
     * Executes a command with the selected file, or prompts the user to select an MCAP file if no file is selected.
     * @returns The file path of the selected file, or null if no file is selected.
     */
    const filePath =
      (await executeCommandWithSelectedFile()) ?? (await selectMCAPFile());

    if (!filePath) {
      return;
    }
    const flagsInput = await vscode.window.showInputBox({
      prompt: "Insert optional flags here with their respective arguments",
      placeHolder: "--end-secs=9223372036854775807 --topics=/imu/data,/gps",
      ignoreFocusOut: false,
    });
    runMCAP([cmd, ""], [flagsInput || ""], [filePath]);
  } else {
    // If the command does not require a sub-command, but sub-commands are found, show an error message
    vscode.window.showErrorMessage(
      `No sub-commands found for ${cmd}. Sub-commands are not required for this command.`
    );
  }
}

export function activate(context: vscode.ExtensionContext) {
  // if (extentionInit() !== true) {
  // 	return;
  // }
  console.log("MCAP path: ", config.get("mcap.mcapPath"));
  console.log(
    'Congratulations, your extension "mcap-cli-vscode" is now active!'
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("mcap-cli-vscode.add", async () => {
      await commandSetup(
        "add",
        [
          {
            command: "attachment",
            description: "Add an attachment to an MCAP file",
          },
          { command: "metadata", description: "Add metadata to an MCAP file" },
        ],
        true
      );
    }),
    vscode.commands.registerCommand("mcap-cli-vscode.cat", async () => {
      await commandSetup("cat", [], false);
      vscode.window.showInformationMessage("Success from mcap-cli cat");
    }),
    vscode.commands.registerCommand("mcap-cli-vscode.list", async () => {
      await commandSetup(
        "list",
        [
          {
            command: "attachment",
            description: "List attachments in an MCAP file",
          },
          { command: "channels", description: "List channels in an MCAP file" },
          { command: "chunks", description: "List chunks in an MCAP file" },
          { command: "metadata", description: "List metadata in an MCAP file" },
          { command: "schemas", description: "List schemas in an MCAP file" },
        ],
        true
      );
      vscode.window.showInformationMessage("Success from mcap-cli list");
    }),
    vscode.commands.registerCommand("mcap-cli-vscode.info", async (uri: vscode.Uri) => {
		console.log("URI: ", uri.fsPath);

      await commandSetup("info", [], false);
      vscode.window.showInformationMessage("Success from mcap-cli info");
    }),
    vscode.commands.registerCommand("mcap-cli-vscode.help", async () => {
      await commandSetup("help", [], false);
      vscode.window.showInformationMessage("Success from mcap-cli help");
    }),
    vscode.commands.registerCommand("mcap-cli-vscode.doctor", async () => {
      await commandSetup("doctor", [], false);
      vscode.window.showInformationMessage("Success from mcap-cli doctor");
    }),
    vscode.commands.registerCommand("mcap-cli-vscode.get", async () => {
      await commandSetup(
        "get",
        [
          {
            command: "attachment",
            description: "Get an attachment by name or offset",
          },
          { command: "metadata", description: "Get metadata by name" },
        ],
        true
      );
      vscode.window.showInformationMessage("Success from mcap-cli get");
    }),
    vscode.commands.registerCommand("mcap-cli-vscode.compress", async () => {
      vscode.window.showInformationMessage("🚧 Coming soon...");
    }),
    vscode.commands.registerCommand("mcap-cli-vscode.decompress", async () => {
      vscode.window.showInformationMessage("🚧 Coming soon...");
    }),
    vscode.commands.registerCommand("mcap-cli-vscode.convert", async () => {
      vscode.window.showInformationMessage("🚧 Coming soon...");
    }),
    vscode.commands.registerCommand("mcap-cli-vscode.recover", async () => {
      vscode.window.showInformationMessage("🚧 Coming soon...");
    }),
    vscode.commands.registerCommand("mcap-cli-vscode.filter", async () => {
      vscode.window.showInformationMessage("🚧 Coming soon...");
    }),
    vscode.commands.registerCommand("mcap-cli-vscode.merge", async () => {
      vscode.window.showInformationMessage("🚧 Coming soon...");
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
