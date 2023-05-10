import { nanoid } from 'nanoid';

// 根据 url 获取 网站的 favicon.ico， 测试阶段先简单运行
export const getFavicon = (url: string) => `https://icon.horse/icon/${new URL(url).hostname}`;

export const genUUID = () => nanoid(10);

// 严格验证是否为 url，只允许 https 和 http 开头的协议
export const isUrl = (str: string) => /^(https?|http):\/\/[^\s/$.?#].[^\s]*$/.test(str);
