//将字典转换成字符串
export function changeDictToString(dict_obj= {}) {
  var sendStr = "{"
  var count = 0
  let dict_length = Object.keys(dict_obj).length
  for (let key in dict_obj) {
    count += 1
    let value = dict_obj[key];

    if (value == null || value == "undefined"){
      value = ""
    }

    if(value != null && value != ""){
      value = JSON.stringify(value);
      if (count === dict_length){
        sendStr += '"'+ key + '"'+ ':' + value
      }else{
        sendStr += '"'+ key + '"'+ ':' + value + ","
      }
    }else {
      if (count === dict_length){
        sendStr += '"'+ key + '"'+ ':' + '"'+ value + '"'
      }else{
        sendStr += '"'+ key + '"'+ ':' + '"'+ value + '"' + ","
      }
    }

  }
  sendStr = sendStr + "}";
  //console.log("查询表单数据集: ", sendStr);
  return sendStr
}
