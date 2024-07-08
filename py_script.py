import requests
import json
import re

from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from enum import Enum
from loguru import logger
from prompt import *

class emPrompt(Enum):
    codeComment=0
    codeSummary=1
    codeSummaryAsk=2

    @classmethod
    def get_prompt_by_index(cls, index):
        match index:
            case cls.codeComment.value:
                return code_comments
            case cls.codeSummary.value:
                return code_summary
            case cls.codeSummaryAsk.value:
                return code_comments_ask
            case _:
                logger.error(f"unknow index:{index}")
    
    @classmethod
    def val_res_by_index(cls, index, res):
        match index:
            case cls.codeComment.value:
                return get_comments(res)
            case _:
                return res

app = FastAPI()

class item(BaseModel):
    query: str
    prompt: int
    ask: str = ""

pattern = re.compile('(""".*?""")', re.DOTALL)


def get_comments(res:str):
    try:
        res = re.findall(pattern, res)[0]
    except Exception as e:
        logger.error(e)
        res = ""
    return res


def get_data_from_qwen(query, prompt: int, ask):
    url = "http://192.168.0.110:31010/api/generate"
    prompt = emPrompt.get_prompt_by_index(prompt).format(code=query, ask=ask)

    payload = json.dumps({
    "model": "qwen2:7b",
    "prompt": prompt,
    "stream": False
    })
    headers = {
        'Content-Type': 'application/json'
    }

    logger.debug(prompt)

    response = requests.request("POST", url, headers=headers, data=payload)
    res = emPrompt.val_res_by_index(prompt, response.json()["response"])
    logger.debug(res)

    return res


@app.post("/generate")
def service(item: item):
    return get_data_from_qwen(item.query, item.prompt, item.ask)



if __name__ == "__main__":
    uvicorn.run("py_script:app", host="0.0.0.0", port=31001)