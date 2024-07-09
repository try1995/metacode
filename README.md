# metacode README
这是一个可以提高代码开发效率的插件

## Features
`Shift+Cmd+p`，搜索metacode，目前功能如下

1.metacode: code comments (add)，添加中文代码注释，需要打开vscode选定代码，插入注释

2.metacode: code summary (show)，解释打开窗口的代码，无需选定代码，弹出解释窗口，如果选定代码则只解释选定的代码

3.metacode: code summary (ask)，弹出窗口，用户补充需要提问的内容：比如get_xxx的方法是做什么用的

## Requirements

1.本地或者远程的llm大模型

2.需要实现py_script中的本地服务接口，本插件使用的是ollama，qwen:7b模型，本地服务能力与插件解耦，方便随时调整

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `metacode.llmHost`: py_script.py中部署的机器ip，默认localhost.
* `metacode.llmPort`: py_scripy.py中部署的端口,默认31001.

## Known Issues

1.目前内嵌的函数，多行缩进有点小问题

TODO 代码自动补全，指定区域的代码解释，单元测试生成

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

Initial release of metacode

### 0.0.2

新增metacode: code summary (ask)

新增可以选择代码块进行解释

### 0.0.3

1.感谢亲妹制作的icon，酷酷的

2.降低插件版本要求到1.68.1


## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**

