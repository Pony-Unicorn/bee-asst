// 根据 url 获取 网站的 favicon.ico， 测试阶段先简单运行
export const getFavicon = (url: string) => `https://icon.horse/icon/${new URL(url).hostname}`;
