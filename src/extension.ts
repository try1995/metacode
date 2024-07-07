// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { globalAgent } from 'http';
import * as vscode from 'vscode';
import { request } from 'follow-redirects/http';
import { IncomingMessage, RequestOptions } from 'http';
import { Buffer } from 'buffer';



// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "metacode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const hellowDisposable = vscode.commands.registerCommand('metacode.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from MetaCodexxxxx!');
	});

	const addCommuentDisposable = vscode.commands.registerCommand('metacode.addComments', () => {
		// 读取配置项
		const config = vscode.workspace.getConfiguration('metacode');
		let llmUrl = config.get<string>('llmUrl');
		console.log(llmUrl);

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
		const response = send_data(text)
			.then(response => {
				let innerResult = JSON.parse(response);  // 去除外部的引号和转义字符
				console.log('Response:', innerResult);
				editor.edit((edit) => {
					let ss =  "def sum(a: int, b: int):\n    \"\"\"\n    @desc:\n        计算两个整数的和。\n        \n    @params:\n        a (int): 第一个整数。\n        b (int): 第二个整数。\n    \n    @return:\n        int: 参数 a 和 b 的和。\n    \"\"\"\n    return a + b\n\ndef checkRes(res:str):\n    \"\"\"\n    @desc:\n        将输入的字符串结果进行格式化处理。\n        \n    @params:\n        res (str): 输入的结果字符串。\n    \n    @return:\n        str: 处理后的结果字符串，去除首尾的特定格式，并返回原始文本内容。\n    \"\"\"\n    res = res.rstrip(\"```python\").lstrip('```')\n    return res"
					edit.replace(editor.selection, innerResult);
					// edit.insert(new vscode.Position(editor.selection.start.line, 0), response);
					vscode.window.showInformationMessage("已完成代码注释！");
				});
			})
			.catch(error => {
				console.error('Error:', error);
				vscode.window.showErrorMessage("llm服务异常!");
				return;
			});

	});


	context.subscriptions.push(hellowDisposable);
	context.subscriptions.push(addCommuentDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }

function send_data(query: string): Promise<string> {
	console.log("Sending request...");

	// 定义请求选项
	const options: RequestOptions = {
		method: 'POST',
		hostname: 'localhost',
		port: 31001,
		path: '/generate',
		headers: {
			'Content-Type': 'application/json'
		}
	};

	// 定义要发送的数据
	const postData = JSON.stringify({
		query: query,
		prompt: 0
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
