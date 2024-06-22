/*
 * @Author: your name
 * @Date: 2021-06-24 11:18:12
 * @LastEditTime: 2021-06-30 15:13:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\utils\guide.js
 */
export function showGuideInfo(guideSteps, guideName, driver) {
    if (localStorage.getItem(guideName) == null) {
        driver.defineSteps(guideSteps);
        driver.start();
        localStorage.setItem(guideName, "alreadyshow");
    }
}