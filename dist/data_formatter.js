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
              if (locationName === 'Beijing') return '??????';
              if (locationName === 'Shandong') return '??????';
              if (locationName === 'Chongqing') return '??????';
              if (locationName === 'Henan') return '??????';
              if (locationName === 'Anhui') return '??????';
              if (locationName === 'Sichuan') return '??????';
              if (locationName === 'Jilin') return '??????';
              if (locationName === 'Guangxi') return '??????';
              if (locationName === 'Shanghai') return '??????';
              if (locationName === 'Zhejiang') return '??????';
              if (locationName === 'Jiangsu') return '??????';
              if (locationName === 'Guangdong') return '??????';
              if (locationName === 'Fujian') return '??????';
              if (locationName === 'Guizhou') return '??????';
              if (locationName === 'Tianjin') return '??????';
              if (locationName === 'Xinjiang') return '??????';
              if (locationName === 'Shanxi') return '??????';
              if (locationName === 'Shaanxi') return '??????';
              if (locationName === 'Liaoning') return '??????';
              if (locationName === 'Hubei') return '??????';
              if (locationName === 'Qinghai') return '??????';
              if (locationName === 'Gansu') return '??????';
              if (locationName === 'Heilongjiang') return '?????????';
              if (locationName === 'Hainan') return '??????';
              if (locationName === 'Hunan') return '??????';
              if (locationName === 'Hebei') return '??????';
              if (locationName === 'Yunnan') return '??????';
              if (locationName === 'Inner Mongolia Autonomous Region') return '?????????';
              if (locationName === 'Tibet') return '??????';
              if (locationName === 'Taiwan') return '??????';
              if (locationName === 'Jiangxi') return '??????';
              if (locationName === 'Ningxia Hui Autonomous Region') return '??????';
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
