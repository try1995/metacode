ss = '''
以下是补全了注释的代码：

```python
def checkRes(res: str):
    """
    @desc:
        去除字符串首部和尾部的特定文本，以获取内部的有效内容。
        
    @params:
        res (str): 需要处理的原始字符串。

    @return:
        str: 处理后的有效内部字符串内容。
    """
    return res.lstrip("```python").rstrip('```')
```

注意：这里的注释是根据代码的功能和参数/返回值类型来描述的。如果实际应用中需要更详细的解释或文档，可以根据具体情况调整注释内容。
'''
import re

pattern = re.compile('(""".*?""")', re.DOTALL)
s = re.findall(pattern, ss)[0]
print(s)

def test():
    def get_comments(res:str):
        try:
            res = re.findall(pattern, res)[0]
        except Exception as e:
            logger.error(e)
            res = ""
        return res


def get_data_from_qwen(query, prompt: int):
    url = "http://192.168.0.110:31010/api/generate"


    payload = json.dumps({
    "model": "qwen2:7b",
    "prompt": emPrompt.get_prompt_by_index(prompt).format(code=query),
    "stream": False
    })
    headers = {
        'Content-Type': 'application/json'
    }

    print(emPrompt.get_prompt_by_index(prompt).format(code=query))

    response = requests.request("POST", url, headers=headers, data=payload)
    res = get_comments(response.json()["response"])
    logger.debug(res)

    return res