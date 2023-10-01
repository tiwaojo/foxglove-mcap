import * as vscode from "vscode";
import { MCAPCommand } from "../types";
import { runMCAPCommand, selectMCAPFile, flagsInput } from "../utils";
import { subCmdInput } from "./inputs";

// Prepare commands
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

  // If the command requires a sub-command, but no sub-commands are found, show an error message
  // if (subCmdItems.length !== 0) {
  const selectedSubCmd = await subCmdInput(subCmdItems, cmd);

  if (!selectedSubCmd) {
    console.log("No sub-command selected.");
    // return;
  }

  let mcapFlags = (await flagsInput()) ?? "";

  // if the command requires an output file but the output flag isn't present, add it
  if (outFile) {
    if (!mcapFlags?.match(/^-o|--output$/)) {
      await flagsInput({
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

  runMCAPCommand(
    [cmd, selectedSubCmd?.label || ""],
    fsPath || [],
    [mcapFlags || ""]
  );
  // } else {
  // If the command does not require a sub-command, but sub-commands are found, show an error message

  // }
}
