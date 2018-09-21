export const convertData = function (data, map) {
  const res = [];
  for (let i = 0; i < data.length; i++) {
    const geoCoord = map[data[i].name];
    if (geoCoord) {
      res.push({
        name: data[i].name,
        value: geoCoord.concat(data[i].value)
      });
    }
  }
  return res;
};

export const provinceCityMap = {
  '山东': {
    '济南市': [117.121225, 36.66466],
    '菏泽市': [115.480656, 35.23375],
    // '济宁市': [116.59, 35.38],
    '德州市': [116.39, 37.45],
    '聊城市': [115.97, 36.45],
    '泰安市': [117.13, 36.18],
    '临沂市': [118.35, 35.05],
    '淄博市': [118.05, 36.78],
    '枣庄市': [117.57, 34.86],
    '滨州市': [118.03, 37.36],
    '潍坊市': [119.1, 36.62],
    '东营市': [118.49, 37.46],
    '青岛市': [120.3, 36.62],
    '烟台市': [120.9, 37.32],
    '威海市': [122.1, 37.2],
    '日照市': [119.1, 35.62],
    '济宁市': [116.7, 35.42],
    '莱芜市': [117.70, 36.28],
  }
};