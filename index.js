import { ZhipuAI } from 'zhipuai-sdk-nodejs-v4';
import dotenv from 'dotenv';
dotenv.config(); // 从.env文件中加载环境变量--ZHIPUAI_API_KEY--密钥
const ai = new ZhipuAI({});

// 将用户查询翻译为SQL查询语句
const translateToSQL = async (userQuery) => {
    const ai = new ZhipuAI();
    try {
        const response = await ai.createCompletions({
            model: "glm-4", // 根据智谱AI提供的模型名称进行替换
            messages: [
                { role: "user", content: `请将以下请求转换为SQL查询: ${userQuery}` }
            ],
            // 其他必要的参数
        });
        console.log('res:', response);
        console.log('message:', response.choices[0].message);
        // 解析response以获取SQL查询语句
        return response;
    } catch (error) {
        console.error("Error translating to SQL:", error);
    }
};


const extractSQLFromText = (text) => {
    // 正则表达式匹配SQL语句，这里假设SQL语句被包含在反引号 `` 或者 单/双引号 '" 中
    const sqlRegex = /```sql(.*?)```/gsi;
    let match;
    const sqlStatements = [];
  
    // 使用正则表达式的exec方法迭代匹配
    while ((match = sqlRegex.exec(text)) !== null) {
      // 将匹配到的SQL语句添加到数组中
      sqlStatements.push(match[1].trim());
    }
  
    return sqlStatements;
  };

// 提取SQL语句
const extractSQL = (response) => {
    // 检查response对象和choices数组是否存在
    if (response && response.choices && response.choices.length > 0) {
        // 提取第一个选择的message字段，这假设只有一个SQL语句被返回
        const sqlMessage = response.choices[0].message;
        // 根据实际结构进一步解析sqlMessage以获取SQL语句
        // 这里的解析取决于message对象的具体结构
        
        // 从sqlMessage中提取SQL语句: 假设SQL语句被包含在反引号 `` 或者 单/双引号 '" 中
        const sqlContent = sqlMessage?.content;
        const sqlStatements = extractSQLFromText(sqlContent);
        return sqlStatements;
    }
    return null;
};

// 调用translateToSQL函数并提取生成的SQL语句
translateToSQL("我想要一瓶水").then(res => {
    // console.log("Generated SQL:", sql);
    const sql = extractSQL(res);
    console.log("Generated SQL:", sql);
});