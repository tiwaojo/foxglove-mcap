import * as assert from 'assert';
import path = require('node:path');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as mcapExt from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	const extensionPath = vscode.extensions.getExtension('mcap-cli-vscode')?.extensionPath;
	const commandsPath = path.join(extensionPath as string, 'src', 'commands');
  
	const commandFiles = vscode.workspace.findFiles(
	  new vscode.RelativePattern(commandsPath, '*.ts')
	);

	commandFiles.then((files) => {
		files.forEach((file) => {
		  const commandModule = require(file.fsPath);
		  const commandName = path.basename(file.fsPath, '.ts');
	
		  test(`Command ${commandName} should be registered`, () => {
			assert.ok(
			  vscode.commands.getCommands().then((commands) => {
				return commands.includes(`mcap-cli-vscode.${commandName}`);
			  })
			);
		  });
	
		  test(`Command ${commandName} should execute without error`, async () => {
			await vscode.commands.executeCommand(`mcap-cli-vscode.${commandName}`);
		  });
		});
	  });

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});
});
