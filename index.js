const si = require('systeminformation');

let Service, Characteristic;

module.exports = (homebridge) => {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory('homebridge-cpu-temperature', 'CpuTemperature', CpuTemperature);
};

class CpuTemperature {
    constructor(log, config) {
        this.log = log;
        this.name = config.name;

        this.temperatureService = new Service.TemperatureSensor(this.name);

        this.temperatureService
            .getCharacteristic(Characteristic.CurrentTemperature)
            .on('get', this.handleTemperatureGet.bind(this));

        this.log.info('CpuTemperature accessory initialized.');
    }

    handleTemperatureGet(callback) {
        si.cpuTemperature()
            .then(data => {
                this.log.info('Current CPU Temperature: ', data.main);
                callback(null, data.main);
            })
            .catch(error => {
                this.log.error('Error getting CPU temperature: ', error);
                callback(error);
            });
    }

    getServices() {
        return [this.temperatureService];
    }
}
