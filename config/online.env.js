/*
 * @Author: your name
 * @Date: 2021-06-25 09:53:24
 * @LastEditTime: 2021-06-25 10:39:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\config\online.env.js
 */
module.exports = merge(prodEnv, {
    NODE_ENV: '"online"',
    API_ROOT: '"//127.0.0.1:8080"'
    // API_ROOT: '"//192.168.21.138:5000"'
  })