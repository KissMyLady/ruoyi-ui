//测试 DES 加密3
const CryptoJS = require('crypto-js')

//参考简书: https://www.jianshu.com/p/604960c569d2
function dateFormat(fmt, date) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
}
//秘钥，必须由16位字符组成
let date = new Date()
let formatDate = dateFormat("YYYY_mm_dd_HH_MM", date)

//hash256计算
let sha256_str = CryptoJS.SHA256(formatDate);
let hash_str = sha256_str.toString()
console.log("sha256_str: ", hash_str);
console.log(": ", hash_str.length);
console.log(": ", hash_str.slice(0, 16).length);
console.log(": ", hash_str.slice(0, 16));

//秘钥，必须由16位字符组成
let secretKey = formatDate
//let secretKey = "2022_04_30_12_34";

console.log("secretKey: ", secretKey);

let content = 'success;解密文本内容';

//AES加密
let key = CryptoJS.enc.Utf8.parse(secretKey);
let srcs = CryptoJS.enc.Utf8.parse(content);
let option = {
  mode:CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7
}
let encrypted = CryptoJS.AES.encrypt(srcs, key, option);
let res_1 = encrypted.toString();
console.log("res_1: ", res_1);

//解密
let decrypt = CryptoJS.AES.decrypt(res_1, key, option);
let res_2 =  CryptoJS.enc.Utf8.stringify(decrypt).toString();
console.log("res_2: ", res_2);
