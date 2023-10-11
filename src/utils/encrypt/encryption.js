import CryptoJS from 'crypto-js'
//import { cipherName } from '@/utils/mySettings'

let cipherName = 'random_key'

function dateFormat(fmt, date) {
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(),        // 年
    'm+': (date.getMonth() + 1).toString(),     // 月
    'd+': date.getDate().toString(),            // 日
    'H+': date.getHours().toString(),           // 时
    'M+': date.getMinutes().toString(),         // 分
    'S+': date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (let k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return fmt
}

let option = {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7
}

//加密
export function aesEncrypt(content) {
  const date = new Date()
  //密钥长度为16位
  let secretKey = dateFormat('YYYY_mm_dd_HH_MM', date)
  let key = CryptoJS.enc.Utf8.parse(secretKey)
  let srcs = CryptoJS.enc.Utf8.parse(content)
  let encrypted = CryptoJS.AES.encrypt(srcs, key, option)
  return encrypted.toString()
}

//解密
export function aesDecrypt(encryptStr) {
  const date = new Date()
  //密钥长度为16位
  let secretKey = dateFormat('YYYY_mm_dd_HH_MM', date)
  let key = CryptoJS.enc.Utf8.parse(secretKey)
  let decrypt = CryptoJS.AES.decrypt(encryptStr, key, option)
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

//升级的加密
export function aesEncrypt_v2(content) {
  let cipherName = window.sessionStorage.getItem(cipherName)
  let key = CryptoJS.enc.Utf8.parse(cipherName)
  let srcs = CryptoJS.enc.Utf8.parse(content)
  let encrypted = CryptoJS.AES.encrypt(srcs, key, option)
  return encrypted.toString()
}

//升级的解密
export function aesDecrypt_v2(encryptStr) {
  let cipherName = window.sessionStorage.getItem(cipherName)
  let key = CryptoJS.enc.Utf8.parse(cipherName)
  let decrypt = CryptoJS.AES.decrypt(encryptStr, key, option)
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}
