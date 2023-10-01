import * as vscode from "vscode";

const config = vscode.workspace.getConfiguration(); // get configuration
// Prepares a terminal and executes the composed mcap command
export async function runMCAPCommand(
  mcapCommands: string[],
  files: string[],
  mcapFlags: string[]
) {
  const mcapClearOutputConf = vscode.workspace
    .getConfiguration()
    .get("mcap.clearOutputBeforeCommand");

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
