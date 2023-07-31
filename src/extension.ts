// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as cp from "child_process";
import { MCAPCommand } from "./types";

const config = vscode.workspace.getConfiguration(); // get configuration

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
	const terminal = vscode.window.terminals.find((terminal) => terminal.name === terminalName);

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

// Prepare a quick pick of .mcap files in the workspace
async function selectMCAPFile() {
	const files = await vscode.workspace.findFiles("**/*.mcap");

	if (files.length === 0) {
		vscode.window.showInformationMessage(
			"No .mcap files found in the workspace."
		);
		return;
	}

	const fileItems: vscode.QuickPickItem[] = files.map((file) => ({
		label: file.path,
		description: file.fsPath,
	}));

	console.log(fileItems);

	const selectedFiles = await vscode.window.showQuickPick(fileItems, {
		placeHolder: "Select a .mcap file",
		onDidSelectItem(item) {
			item.toString();
		},
		matchOnDetail: true,
	});
	return selectedFiles;
}

// Prepare commands
async function commandSetup(cmd: MCAPCommand, subCmds: MCAPCommand[]) {
	const subCmdItems: vscode.QuickPickItem[] = subCmds.map((e) => ({
		label: e.command as string,
		description: e.description as string,
	}));
	let selectedSubCmd: vscode.QuickPickItem | undefined;
	if (subCmdItems.length !== 0) {
		// Select sub-commands
		selectedSubCmd = await vscode.window
			.showQuickPick(subCmdItems, {
				matchOnDetail: true,
				canPickMany: false,
				placeHolder: "attachment", title: cmd.description
			})
			.then((val) => {
				return val;
			});
	}

	// Select command flags
	const flagsInput = await vscode.window
		.showInputBox({
			prompt: "Insert optional flags here with their respective arguments",
			placeHolder: "e.g. '--end-secs 9223372036854775807 --topics=/imu/data'", ignoreFocusOut: false
		})
		.then((val) => {
			return val;
		});

	// Select file
	const file = await selectMCAPFile().then((res) => {
		return res?.label;
	});

	
	if (file?.length as number <= 0) {

		return;
	}

	runMCAP(
		[cmd.command, selectedSubCmd?.label as string],
		[flagsInput as string],
		[file as string]
	);
}

export function activate(context: vscode.ExtensionContext) {

	// if (extentionInit() !== true) {
	// 	return;
	// }

	console.log("MCAP path: ", config.get("mcap.mcapPath"));
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log(
		'Congratulations, your extension "mcap-cli-vscode" is now active!'
	);

	// MCAP: Add
	let mcapAdd = vscode.commands.registerCommand(
		"mcap-cli-vscode.add",
		async () => {
			const subCmds: MCAPCommand[] = [
				{ command: "attachment", description: "Add an attachment to an MCAP file", },
				{ command: "metadata", description: "Add metadata to an MCAP file" },
			];
			await commandSetup({ command: "add", description: "Add records to an existing MCAP file" }, subCmds);
		}
	);

	// MCAP: Cat
	let mcapCat = vscode.commands.registerCommand(
		"mcap-cli-vscode.cat",
		async () => {
			await commandSetup({ command: 'cat', description: 'Cat the messages in an MCAP file to stdout' }, []);
			vscode.window.showInformationMessage("Success from mcap-cli cat");
		}
	);

	// MCAP: List
	let mcapList = vscode.commands.registerCommand(
		"mcap-cli-vscode.list",
		async () => {
			const subCmds: MCAPCommand[] = [
				{ command: "attachment", description: "List attachments in an MCAP file", },
				{ command: "channels", description: "List channels in an MCAP file" },
				{ command: "chunks", description: "List chunks in an MCAP file" },
				{ command: "metadata", description: "List metadata in an MCAP file" },
				{ command: "schemas", description: "List schemas in an MCAP file" },
			];
			await commandSetup({ command: "list", description: "List records of an MCAP file" }, subCmds);
			vscode.window.showInformationMessage("Success from mcap-cli list");
		}
	);

	// MCAP: Info
	let mcapInfo = vscode.commands.registerCommand(
		"mcap-cli-vscode.info",
		async () => {

			await commandSetup({ command: "info", description: "Report statistics about an MCAP file" }, []);
			vscode.window.showInformationMessage("Success from mcap-cli info");
		}
	);

	// MCAP: Help
	let mcapHelp = vscode.commands.registerCommand(
		"mcap-cli-vscode.help",
		async () => {
			await commandSetup({ command: "help", description: "Help about any command" }, []);
			vscode.window.showInformationMessage("Success from mcap-cli help");
		}
	);

	// MCAP: Doctor
	let mcapDoctor = vscode.commands.registerCommand(
		"mcap-cli-vscode.doctor",
		async () => {
			await commandSetup({ command: "doctor", description: "Check an MCAP file structure" }, []);
			vscode.window.showInformationMessage("Success from mcap-cli doctor");
		}
	);

	// MCAP: Get
	let mcapGet = vscode.commands.registerCommand(
		"mcap-cli-vscode.get",
		async () => {
			const subCmds: MCAPCommand[] = [
				{ command: "attachment", description: "Get an attachment by name or offset", },
				{ command: "metadata", description: "Get metadata by name" },
			];
			await commandSetup({ command: "get", description: "Get a record from an MCAP file" }, subCmds);
			vscode.window.showInformationMessage("Success from mcap-cli get");
		}
	);

	// MCAP: Compress
	let mcapCompress = vscode.commands.registerCommand(
		"mcap-cli-vscode.compress",
		async () => {
			vscode.window.showInformationMessage("🚧 Comming soon...");
		}
	);

	// MCAP: Decompress
	let mcapDecompress = vscode.commands.registerCommand(
		"mcap-cli-vscode.decompress",
		async () => {
			vscode.window.showInformationMessage("🚧 Comming soon...");
		}
	);

	// MCAP: Convert
	let mcapConvert = vscode.commands.registerCommand(
		"mcap-cli-vscode.convert",
		async () => {
			vscode.window.showInformationMessage("🚧 Comming soon...");
		}
	);

	// MCAP: Recover
	let mcapRecover = vscode.commands.registerCommand(
		"mcap-cli-vscode.recover",
		async () => {
			vscode.window.showInformationMessage("🚧 Comming soon...");
		}
	);

	// MCAP: Filter
	let mcapFilter = vscode.commands.registerCommand(
		"mcap-cli-vscode.filter",
		async () => {
			vscode.window.showInformationMessage("🚧 Comming soon...");
		}
	);

	// MCAP: Merge
	let mcapMerge = vscode.commands.registerCommand(
		"mcap-cli-vscode.merge",
		async () => {
			vscode.window.showInformationMessage("🚧 Comming soon...");
		}
	);

	context.subscriptions.push(mcapAdd, mcapCat, mcapList, mcapInfo, mcapHelp, mcapDoctor, mcapGet, mcapCompress, mcapDecompress, mcapConvert, mcapRecover, mcapFilter, mcapMerge);
}

// This method is called when your extension is deactivated
export function deactivate() { }
