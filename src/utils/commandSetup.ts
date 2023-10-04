import { MCAPCommand } from "../types";
import { runMCAPCommand, showInputBox } from "../utils";
import { showQuickPick } from "./inputs";

/**
 * Sets up and runs an MCAP command with the given sub-commands, file system paths, and output file flag.
 * @param cmd - The main command to run.
 * @param subCmds - An array of sub-commands to choose from.
 * @param fsPath - An array of file system paths to use.
 * @param outFile - A boolean indicating whether an output file is required.
 */
export async function commandSetup(
  cmd: string,
  subCmds: MCAPCommand[],
  fsPath: string[],
  outFile: boolean
) {
  const subCmdItems = subCmds.map((e) => ({
    label: e.command,
    description: e.description,
  }));

  // Allow the user to select a sub-command
  const selectedSubCmd = await showQuickPick(subCmdItems, cmd);

  if (!selectedSubCmd) {
    console.log("No sub-command selected.");
  }

  let mcapFlags = (await showInputBox()) ?? "";

  // if the command requires an output file but the output flag isn't present, add it
  if (outFile) {
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
  }

  await runMCAPCommand(
    [cmd, selectedSubCmd?.label || ""],
    fsPath || [],
    [mcapFlags || ""]
  );
}
