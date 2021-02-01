# Google Form App Script Generator
----------------------------------------------------------------
用来将指定格式的文本转为 Google Form App Script

## 支持的格式：

### 单选

[单选] 关于以下描述，以下说法正确的是：

A 答案1。  
B 答案2。  
C 答案3.  
D 答案4.  

答案：D  
解析：解析详情（不支持换行）。  

### 多选


### 单选

[多选] 关于以下描述，以下说法正确的是：

A 答案1。  
B 答案2。  
C 答案3.  
D 答案4.  

答案：ABD  
解析：解析详情（不支持换行）。

### 小节

[分节] 小节标题

这一节描述了以下内容：  
1. 第一行  
2. 第二行  
……  

[分节结束]

## 不支持的部分：

- GridItem：因为没有找到为这种类型的问题设置答案的API
- 题目描述中添加Image：目前没有找到相关的API
- 一些考试设置，如提交后立即公布分数：目前没有找到相关的API