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

// 将json对象中的true, false替换成1和0
export function switchBool2Number(jsonObject= {}) {
  for (let key in jsonObject) {
    if (jsonObject[key] == 'true' || jsonObject[key] === true) {
      jsonObject[key] = 1;
    } else if (jsonObject[key] == 'false' || jsonObject[key] === false) {
      jsonObject[key] = 0;
    }
  }
  //console.log("解析json返回", jsonObject);
  return jsonObject;
}

//将[json]对象中的true, false替换成1和0 [{}, {}, {}, ...]
export function switchListBool2Number(jsonObject= []) {
  for (let i=0; i<jsonObject.length; i++){
    let items = jsonObject[i];
    //遍历item内部数据
    for (let item in items) {
      if (items[item] == 'true' || items[item] === true) {
        items[item] = 1;
      } else if (items[item] == 'false' || items[item] === false) {
        items[item] = 0;
      }
    }
  }
  //console.log("解析[json]返回", jsonObject);
  return jsonObject;
}
