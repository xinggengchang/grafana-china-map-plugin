'use strict';

System.register(['lodash', './geohash', './china_city_mapping'], function (_export, _context) {
  "use strict";

  var _, decodeGeoHash, py2hz, _createClass, DataFormatter;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_geohash) {
      decodeGeoHash = _geohash.default;
    }, function (_china_city_mapping) {
      py2hz = _china_city_mapping.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      DataFormatter = function () {
        function DataFormatter(ctrl, kbn) {
          _classCallCheck(this, DataFormatter);

          this.ctrl = ctrl;
          this.kbn = kbn;
        }

        _createClass(DataFormatter, [
          {
            key:'createDataValue',
            value: function createDataValue(encodedGeohash, decodedGeohash, locationName, value) {
              if(decodedGeohash){
                const dataValue = {
                                key: encodedGeohash,
                                name: locationName,
                                locationLatitude: decodedGeohash.latitude,
                                locationLongitude: decodedGeohash.longitude,
                                value: value,
                                valueFormatted: value,
                                valueRounded: 0,
                                };
                dataValue.valueRounded = this.kbn.roundValue(dataValue.value, this.ctrl.panel.decimals || 0);
                return dataValue;
              }else{
                const dataValue = {
                                key: encodedGeohash,
                                name: locationName,
                                locationLatitude: 0,
                                locationLongitude: 0,
                                value: value,
                                valueFormatted: value,
                                valueRounded: 0,
                                };
                dataValue.valueRounded = this.kbn.roundValue(dataValue.value, this.ctrl.panel.decimals || 0);
                return dataValue;
              }
            }
          },{
            key:'getRegoinName',
            value: function getRegoinName(locationName) {
              if (locationName === 'Beijing') return '北京';
              if (locationName === 'Shandong') return '山东';
              if (locationName === 'Chongqing') return '重庆';
              if (locationName === 'Henan') return '河南';
              if (locationName === 'Anhui') return '安徽';
              if (locationName === 'Sichuan') return '四川';
              if (locationName === 'Jilin') return '吉林';
              if (locationName === 'Guangxi') return '广西';
              if (locationName === 'Shanghai') return '上海';
              if (locationName === 'Zhejiang') return '浙江';
              if (locationName === 'Jiangsu') return '江苏';
              if (locationName === 'Guangdong') return '广东';
              if (locationName === 'Fujian') return '福建';
              if (locationName === 'Guizhou') return '贵州';
              if (locationName === 'Tianjin') return '天津';
              if (locationName === 'Xinjiang') return '新疆';
              if (locationName === 'Shanxi') return '山西';
              if (locationName === 'Shaanxi') return '陕西';
              if (locationName === 'Liaoning') return '辽宁';
              if (locationName === 'Hubei') return '湖北';
              if (locationName === 'Qinghai') return '青海';
              if (locationName === 'Gansu') return '甘肃';
              if (locationName === 'Heilongjiang') return '黑龙江';
              if (locationName === 'Hainan') return '海南';
              if (locationName === 'Hunan') return '湖南';
              if (locationName === 'Hebei') return '河北';
              if (locationName === 'Yunnan') return '云南';
              if (locationName === 'Inner Mongolia Autonomous Region') return '内蒙古';
              if (locationName === 'Tibet') return '西藏';
              if (locationName === 'Taiwan') return '台湾';
              if (locationName === 'Jiangxi') return '江西';
              if (locationName === 'Ningxia Hui Autonomous Region') return '宁夏';
              return locationName;
            }
          },{
          key: 'setValues',
          value: function setValues(data) {
            var _this = this;

            if (this.ctrl.series && this.ctrl.series.length > 0) {
              var highestValue = 0;
              var lowestValue = Number.MAX_VALUE;

              this.ctrl.series.forEach(function (serie) {
                var lastPoint = _.last(serie.datapoints);
                var lastValue = _.isArray(lastPoint) ? lastPoint[0] : null;
                var location = _.find(_this.ctrl.locations, function (loc) {
                  return loc.key.toUpperCase() === serie.alias.toUpperCase();
                });

                if (!location) return;

                if (_.isString(lastValue)) {
                  data.push({ key: serie.alias, value: 0, valueFormatted: lastValue, valueRounded: 0 });
                } else {
                  var dataValue = {
                    key: serie.alias,
                    locationName: location.name,
                    locationLatitude: location.latitude,
                    locationLongitude: location.longitude,
                    value: serie.stats[_this.ctrl.panel.valueName],
                    valueFormatted: lastValue,
                    valueRounded: 0
                  };

                  if (dataValue.value > highestValue) highestValue = dataValue.value;
                  if (dataValue.value < lowestValue) lowestValue = dataValue.value;

                  dataValue.valueRounded = _this.kbn.roundValue(dataValue.value, parseInt(_this.ctrl.panel.decimals, 10) || 0);
                  data.push(dataValue);
                }
              });

              data.highestValue = highestValue;
              data.lowestValue = lowestValue;
              data.valueRange = highestValue - lowestValue;
            }
          }
        }, {
          key: 'setGeohashValues',
          value: function setGeohashValues(dataList, data) {
            if (!this.ctrl.panel.esGeoPoint && !this.ctrl.panel.esMetric) {
              return;
            }

            if (dataList && dataList.length > 0) {
              let highestValue = 0;
              let lowestValue = Number.MAX_VALUE;
              dataList.forEach(result => {
                if (result.type === 'table') {
                  const columnNames = {};
                  result.columns.forEach((column, columnIndex) => {
                    columnNames[column.text] = columnIndex;
                  });

                  result.rows.forEach(row => {
                    const encodedGeohash = this.ctrl.panel.esGeoPoint ? row[columnNames[this.ctrl.panel.esGeoPoint]] : NaN;
                    const decodedGeohash = this.ctrl.panel.esGeoPoint ? decodeGeoHash(encodedGeohash) : NaN;
                    const locationName = this.ctrl.panel.esLocationName
                      ? this.getRegoinName(row[columnNames[this.ctrl.panel.esLocationName]])
                      : encodedGeohash;

                    const value = row[columnNames[this.ctrl.panel.esMetric]];

                    const dataValue = this.createDataValue(encodedGeohash, decodedGeohash, locationName, value);
                    if (dataValue.value > highestValue) {
                      highestValue = dataValue.value;
                    }

                    if (dataValue.value < lowestValue) {
                      lowestValue = dataValue.value;
                    }

                    data.push(dataValue);
                  });

                  data.highestValue = highestValue;
                  data.lowestValue = lowestValue;
                  data.valueRange = highestValue - lowestValue;
                } else {
                  result.datapoints.forEach(datapoint => {
                    const encodedGeohash = datapoint[this.ctrl.panel.esGeoPoint];
                    const decodedGeohash = decodeGeoHash(encodedGeohash);
                    const locationName = this.ctrl.panel.esLocationName
                      ? datapoint[this.ctrl.panel.esLocationName]
                      : encodedGeohash;
                    const value = datapoint[this.ctrl.panel.esMetric];

                    const dataValue = this.createDataValue(encodedGeohash, decodedGeohash, locationName, value);
                    if (dataValue.value > highestValue) {
                      highestValue = dataValue.value;
                    }
                    if (dataValue.value < lowestValue) {
                      lowestValue = dataValue.value;
                    }
                    data.push(dataValue);
                  });

                  data.highestValue = highestValue;
                  data.lowestValue = lowestValue;
                  data.valueRange = highestValue - lowestValue;
                }
              });
            }
          }

        }, {
          key: 'setTableValues',
          value: function setTableValues(tableData, data) {
            var _this3 = this;

            if (tableData && tableData.length > 0) {
              var highestValue = 0;
              var lowestValue = Number.MAX_VALUE;

              tableData[0].forEach(function (datapoint) {
                if (!datapoint.geohash) {
                  return;
                }

                var encodedGeohash = datapoint.geohash;
                var decodedGeohash = decodeGeoHash(encodedGeohash);

                var dataValue = {
                  key: encodedGeohash,
                  locationName: datapoint[_this3.ctrl.panel.tableLabel] || 'n/a',
                  locationLatitude: decodedGeohash.latitude,
                  locationLongitude: decodedGeohash.longitude,
                  value: datapoint.metric,
                  valueFormatted: datapoint.metric,
                  valueRounded: 0
                };

                if (dataValue.value > highestValue) highestValue = dataValue.value;
                if (dataValue.value < lowestValue) lowestValue = dataValue.value;

                dataValue.valueRounded = _this3.kbn.roundValue(dataValue.value, _this3.ctrl.panel.decimals || 0);
                data.push(dataValue);
              });

              data.highestValue = highestValue;
              data.lowestValue = lowestValue;
              data.valueRange = highestValue - lowestValue;
            }
          }
        }, {
          key: 'aggByProvince',
          value: function aggByProvince(data) {
            if (!data || data.length == 0) return [];

            var sum = function sum(total, item) {
              return total += item.value;
            };
            var ret = _.chain(data).groupBy('name').map(function (group, name) {
              return { name: name, value: _.reduce(group, sum, 0) };
            }).value();

            return ret;
          }
        }], [{
          key: 'tableHandler',
          value: function tableHandler(tableData) {
            var datapoints = [];

            if (tableData.type === 'table') {
              var columnNames = {};

              tableData.columns.forEach(function (column, columnIndex) {
                columnNames[columnIndex] = column.text;
              });

              tableData.rows.forEach(function (row) {
                var datapoint = {};

                row.forEach(function (value, columnIndex) {
                  var key = columnNames[columnIndex];
                  datapoint[key] = value;
                });

                datapoints.push(datapoint);
              });
            }

            return datapoints;
          }
        }]);

        return DataFormatter;
      }();

      _export('default', DataFormatter);
    }
  };
});
//# sourceMappingURL=data_formatter.js.map
