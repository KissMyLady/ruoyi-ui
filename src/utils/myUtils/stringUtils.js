

//超过字符的隐藏
export function LimitStringShow(dataStr, sLen=20) {
  if(typeof dataStr === 'string' && dataStr.length >= sLen){
    let lenStr = dataStr.length;
    return dataStr.substr(0, sLen) + '...'+ (lenStr - sLen);
  }
  return dataStr;

}
