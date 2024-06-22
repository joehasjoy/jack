/*
 * @Author: your name
 * @Date: 2021-06-09 16:19:17
 * @LastEditTime: 2021-06-25 11:30:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\config\dev.env.js
 */
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
module.exports = merge(prodEnv, {
  NODE_ENV: '"dev"',
  API_ROOT: '"//127.0.0.1:8080"'
  // API_ROOT: '"//192.168.21.138:5000"'
})
