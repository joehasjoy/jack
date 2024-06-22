/*
 * @Author: your name
 * @Date: 2021-06-24 14:02:06
 * @LastEditTime: 2021-06-24 15:32:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\guide\app.js
 */
export default [
    {
        element: "#createProject", //传递选择器即可突出显示单个元素
        popover: {
            title: "第一步",
            description: "点击创建应用,填写好应用后等待审批",
            position: "bottom-center", // 可选 `top`, `left`, `right`, `bottom`
        },
    },
    {
        element: "#appCode", //传递选择器即可突出显示单个元素
        popover: {
            title: "第二步",
            description: "填写AppCode",
            position: "bottom-center", // 可选 `top`, `left`, `right`, `bottom`
        },
    },
    {
        element: "#groupIdStr", //传递选择器即可突出显示单个元素
        popover: {
            title: "第三步",
            description: "填写业务域信息",
            position: "bottom-center", // 可选 `top`, `left`, `right`, `bottom`
        },
    },
    {
        element: "#appSearch", //传递选择器即可突出显示单个元素
        popover: {
            title: "第四步",
            description: "点击查询信息",
            position: "bottom-center", // 可选 `top`, `left`, `right`, `bottom`
        },
    },
];