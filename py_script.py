import requests
import json
import re

from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from enum import Enum
from loguru import logger

class emPrompt(Enum):
    codeComment=0

    @classmethod
    def get_prompt_by_index(cls, index):
        match index:
            case cls.codeComment.value:
                return code_comments

app = FastAPI()

class item(BaseModel):
    query: str
    prompt: int

pattern = re.compile('(""".*?""")', re.DOTALL)


code_comments = '''
你是一个高级程序员，请为下面的代码添加详细的注释，并将注释添加到代码中。注释的示例代码格式如下：

def sum(a: int, b: int):
    """
    @desc:
        计算两个整数的和。
        
    @params:
        a (int): 第一个整数。
        b (int): 第二个整数。
    
    @return:
        int: 参数 a 和 b 的和。
    """
    return a + b

保持代码缩进，返回的结果只需要补全@desc，@params，@return的内容，不要包含任何额外的文本或解释，也不要使用任何格式标记，只允许添加注释，禁止修改源代码，禁止返回示例代码

代码：
{code}

'''

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


@app.post("/generate")
def service(item: item):
    return get_data_from_qwen(item.query, item.prompt)



if __name__ == "__main__":
    uvicorn.run("py_script:app", host="0.0.0.0", port=31001)