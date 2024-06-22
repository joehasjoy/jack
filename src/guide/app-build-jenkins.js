/*
 * @Author: your name
 * @Date: 2021-06-24 16:20:53
 * @LastEditTime: 2021-06-30 14:52:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\guide\createproject.js
 */
export default [
    {
        element: "#appcode", //传递选择器即可突出显示单个元素
        popover: {
            title: "第一步",
            description: "查看当前的应用信息",
            position: "left-center", // 可选 `top`, `left`, `right`, `bottom`
        },
    },
    {
        element: "#buildtable", //传递选择器即可突出显示单个元素
        popover: {
            title: "第二步",
            description: "查看历史构建记录",
            position: "right-center", // 可选 `top`, `left`, `right`, `bottom`
        },
    },
    {
        element: "#buildSteps", //传递选择器即可突出显示单个元素
        popover: {
            title: "第三步",
            description: "查看发布阶段详细信息",
            position: "left-center", // 可选 `top`, `left`, `right`, `bottom`
        },
    },
    {
        element: "#new-version", //传递选择器即可突出显示单个元素
        popover: {
            title: "第四步",
            description: "点击可构建新版本",
            position: "right-center", // 可选 `top`, `left`, `right`, `bottom`
        },
    },
    {
        element: "#logs", //传递选择器即可突出显示单个元素
        popover: {
            title: "第五步",
            description: "点击可实时查看构建日志信息",
            position: "left-center", // 可选 `top`, `left`, `right`, `bottom`
        },
    },
    {
        element: "#buildmodel", //传递选择器即可突出显示单个元素
        popover: {
            title: "第六步",
            description: "可根据情况选择虚机发布还是K8s发布",
            position: "left-center", // 可选 `top`, `left`, `right`, `bottom`
        },
    },
];