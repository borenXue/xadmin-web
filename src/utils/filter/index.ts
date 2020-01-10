/* eslint-disable no-use-before-define */
import Vue from 'vue';


Vue.filter('filterArray', filterArray);
Vue.filter('filterTime', filterTime);


function filterArray(value: any, arr: any[], key = 'id', name = 'name', emptyDesc = '') {
  if (value === null || value === undefined) {
    return emptyDesc;
  }
  for (const item of arr) {
    if (item[key] === value) return item[name];
  }
  return emptyDesc || value;
}

function filterTime(timeOrigin: any, cFormat: any) {
  let time = timeOrigin;
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if ((`${time}`).length === 10) {
      time = parseInt(time) * 1000 // eslint-disable-line
    }
    date = new Date(time);
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result: any, key: any) => {
    let value = formatObj[key];
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
    if (result.length > 0 && value < 10) {
      value = `0${value}`;
    }
    return value || 0;
  });
  return timeStr;
}
