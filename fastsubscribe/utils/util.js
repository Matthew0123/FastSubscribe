const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  objToStrMap: objToStrMap,
  startWith: startWith
}
/** 
*对象转换为Map 
*/
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
} 
/**
 * 字符串以开头
 */ 
function startWith(allstr,str)
{
  if (str == null || str == "" || allstr.length == 0 || str.length > allstr.length)
    return false;
  if (allstr.substr(0, str.length) == str)
    return true;
  else
    return false;
  return true;
}