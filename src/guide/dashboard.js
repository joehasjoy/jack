/*
 * @Author: your name
 * @Date: 2021-06-24 11:02:44
 * @LastEditTime: 2021-06-30 14:13:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\guide\dashboard.js
 */
export default [
    {
        element: "#vidoeguide", //传递选择器即可突出显示单个元素
        popover: {
            title: "第一步",
            description: "请查看DevOps平台操作视频,熟悉使用技巧",
            position: "top-center", // 可选 `top`, `left`, `right`, `bottom`
        },
    },
    {
        element: "#document", //传递选择器即可突出显示单个元素
        popover: {
            title: "第二步",
            description: "请详细阅读接入文档",
            position: "top-center", // 可选 `top`, `left`, `right`, `bottom`
        },
    },
    {
        element: "#allproject", //传递选择器即可突出显示单个元素
        popover: {
            title: "第三步",
            description: "点击全部可查看所有的应用",
            position: "top-center", // 可选 `top`, `left`, `right`, `bottom`
        },
    },
    {
        element: "#feedback", //传递选择器即可突出显示单个元素
        popover: {
            title: "第四步",
            description: "如果对平台有什么好的意见或者建议，请点击反馈信息",
            position: "top-center", // 可选 `top`, `left`, `right`, `bottom`
        },
    },
   
];