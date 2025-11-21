export const cleanupUrl = (url: string)=>{
    /**
     * This function will remove all trailing slashes from the URL
     * eg. https://apmctest.com// => https://apmctest.com * 
     */

    return url.replace(/\/+$/, '')
}