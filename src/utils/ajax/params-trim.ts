import { AxiosRequestConfig } from 'axios';

function deleteParams(obj: any, deleteEmptyString: boolean = false) {
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return;
  }
  for (const key in obj) { // eslint-disable-line guard-for-in
    const val = obj[key];
    if (val === undefined || val === null || (val === '' && deleteEmptyString)) {
      delete obj[key];
    } else if (val instanceof Array) {
      for (const item of val) {
        if (typeof item === 'object') deleteParams(item, deleteEmptyString);
      }
    } else if (typeof val === 'object') {
      obj[key] = deleteParams(val, deleteEmptyString);
    }
  }
}

export default function deleteRequestEmptyParams(config: AxiosRequestConfig) {
  if (config.params) {
    deleteParams(config.params, true);
  }
  if (config.data) {
    deleteParams(config.data);
  }
}
