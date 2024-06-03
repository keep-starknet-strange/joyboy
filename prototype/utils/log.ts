export const logDev = (content: string) => {
    process.env.NODE_ENV == "development" && console.log(content)
} 