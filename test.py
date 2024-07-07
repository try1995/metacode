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
