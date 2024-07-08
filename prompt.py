code_summary = '''
你是一个高级程序员，请为下面的代码进行中文总结

代码：
{code}

'''

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