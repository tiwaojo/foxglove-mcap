import * as vscode from "vscode";

/**
 * Runs an MCAP command in the terminal.
 * @param mcapCommands An array of MCAP commands to run.
 * @param files An array of file paths to include in the command.
 * @param mcapFlags An array of flags to include in the command.
 */
export async function runMCAPCommand(
  mcapCommands: string[],
  files: string[],
  mcapFlags: string[]
  ) {
  const config = vscode.workspace.getConfiguration(); // get configurations

  const terminalName = "MCAP Output";

  // Find if our terminal exists so it can be reused
  const terminal = vscode.window.terminals.find(
    (terminal) => terminal.name === terminalName
  );

  // Compose the mcap command that will be used in the terminal
  const mcapCommand = `${config.get("mcap.mcapPath")} ${mcapCommands.join(
    " "
  )} ${files.join(" ")} ${mcapFlags.join(" ")} `;
  console.log("MCAP COMMAND: ", mcapCommand);

  if (config.get("mcap.clearOutputBeforeCommand")) {
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
