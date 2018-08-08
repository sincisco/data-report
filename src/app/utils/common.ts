import * as _ from 'lodash';

export function closestNum(num) {
  return Math.round(num * 0.1) * 10;
}

export function removeUndefined(obj) {
  if (_.isPlainObject(obj)) {
    const result = _.omitBy(obj, _.isUndefined);
    return _.mapValues(result, function (value, key, object) {
      return removeUndefined(value);
    });
  } else if (_.isArray(obj)) {
    return obj.map((item) => {
      return removeUndefined(item);
    });
  } else {
    return obj;
  }
}
