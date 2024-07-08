// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { globalAgent } from 'http';
import * as vscode from 'vscode';
import { request } from 'follow-redirects/http';
import { IncomingMessage, RequestOptions } from 'http';
import { Buffer } from 'buffer';
import { Init } from 'v8';



// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "metacode" is now active!');

	const codeCommuentDisposable = vscode.commands.registerCommand('metacode.codeComments', () => {
		const global = vscode.window;
		const editor = global.activeTextEditor;
		if (!editor) {
			return;
		}
		const document = editor.document;
		let text = document.getText(editor.selection);
		if (!text) {
			text = "请选择需要处理的完整代码块！";
		}
		vscode.window.showInformationMessage("代码注释正在进行...");
		const response = send_data(text, 0)
			.then(response => {
				let innerResult = JSON.parse(response);  // 去除外部的引号和转义字符
				console.log('Response:', innerResult);
				editor.edit((edit) => {
					// edit.replace(editor.selection, innerResult);
				    const selection = editor.selection;
					const document = editor.document;

					// 获取选择区域的首行
					let cur_line = selection.start.line;
					const lineText = document.lineAt(cur_line+1).text;
					const indent = getIndentation(lineText); // 获取当前行的缩进
					// for (let line of innerResult.split("\n")) {
					// 	edit.insert(new vscode.Position(cur_line+1, 0),  `${indent}`+line+`\n`);
					// }
					// TODO 嵌套类型的缩进有问题
					edit.insert(new vscode.Position(cur_line+1, 0),  `${indent}`+innerResult+`\n`);
					vscode.window.showInformationMessage("已完成代码注释！");
				});
			})
			.catch(error => {
				console.error('Error:', error);
				vscode.window.showErrorMessage("llm服务异常!");
				return;
			});

	});

	const codeSummaryDisposable = vscode.commands.registerCommand('metacode.codeSummary', () => {
		const global = vscode.window;
		const editor = global.activeTextEditor;
		if (!editor) {
			return;
		}
		const document = editor.document;
		vscode.window.showInformationMessage("代码总结正在进行...");

		let text = document.getText(editor.selection);
		if (!text) {
			text = document.getText();
		}
		const response = send_data(text, 1)
			.then(response => {
				let innerResult = JSON.parse(response);  // 去除外部的引号和转义字符
				console.log('Response:', innerResult);
				vscode.window.showInformationMessage(innerResult, { modal: true });
			})
			.catch(error => {
				console.error('Error:', error);
				vscode.window.showErrorMessage("llm服务异常!");
				return;
			});
	});

	const codeSummaryAskDisposable = vscode.commands.registerCommand('metacode.codeSummaryAsk', () => {
		const global = vscode.window;
		const editor = global.activeTextEditor;
		if (!editor) {
			return;
		}
		const document = editor.document;
		// 调用showInputBox方法显示输入框
		let ask = '请解释其主要功能';
		const result = vscode.window.showInputBox({
			prompt: '请输入和代码相关的问题',
            placeHolder: ask
		}).then(value => {
			// 检查用户是否输入了值
			if (value !== undefined) {
				ask = value ? value : ask;
			}
			vscode.window.showInformationMessage(`ask：${ask}。代码总结正在进行...`);
			let text = document.getText(editor.selection);
			if (!text) {
				text = document.getText();
			}
			const response = send_data(text, 2, ask)
			.then(response => {
				let innerResult = JSON.parse(response);  // 去除外部的引号和转义字符
				console.log('Response:', innerResult);
				vscode.window.showInformationMessage(innerResult, { modal: true });
			})
			.catch(error => {
				console.error('Error:', error);
				vscode.window.showErrorMessage("llm服务异常!");
				return;
			});

		}) ;


	});

	context.subscriptions.push(codeCommuentDisposable);
	context.subscriptions.push(codeSummaryDisposable);
	context.subscriptions.push(codeSummaryAskDisposable);
}

function getIndentation(line: string) {
    const match = line.match(/^\s*/);
    return match ? match[0] : '';
}


// This method is called when your extension is deactivated
export function deactivate() { }

function send_data(query: string, prompt: number, ask: string = ""): Promise<string> {
	console.log("Sending request...");
	// 读取配置项
	const config = vscode.workspace.getConfiguration('metacode');
	let llmHost = config.get<string>('llmHost');
	console.log(llmHost);
	let llmPort = config.get<string>('llmPort');
	console.log(llmPort);

	// 定义请求选项
	const options: RequestOptions = {
		method: 'POST',
		hostname: llmHost,
		port: llmPort,
		path: '/generate',
		headers: {
			'Content-Type': 'application/json'
		}
	};

	// 定义要发送的数据
	const postData = JSON.stringify({
		query: query,
		prompt: prompt,
		ask: ask
	});


	// Create a function to send the request and return the result
	return new Promise((resolve, reject) => {
		const req = request(options, (res: IncomingMessage) => {
			const chunks: Buffer[] = [];

			res.on('data', (chunk: Buffer) => {
				chunks.push(chunk);
			});

			res.on('end', () => {
				const body = Buffer.concat(chunks).toString();
				resolve(body);
			});

			res.on('error', (error: Error) => {
				reject(error);
			});
		});

		req.write(postData);
		req.end();
	});
}
