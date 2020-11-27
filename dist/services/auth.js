"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var utility_1 = require("./utility");
var authHeaderKeys = [
    'access-token',
    'token-type',
    'client',
    'expiry',
    'uid',
];
exports.setAuthHeaders = function (Storage, headers) {
    var promises = [];
    authHeaderKeys.forEach(function (key) {
        var promise = Storage.getItem(key).then(function (fromStorage) {
            var value = headers[key] || fromStorage;
            axios_1.default.defaults.headers.common[key] = value;
        });
        promises.push(promise);
    });
    return Promise.all(promises).then(function () { });
};
exports.persistAuthHeadersInDeviceStorage = function (Storage, headers) {
    var promises = [];
    authHeaderKeys.forEach(function (key) {
        var promise = Storage.getItem(key).then(function (fromStorage) {
            var value = headers[key] || fromStorage;
            return Storage.setItem(key, value); // <--- Not really needed
        });
        promises.push(promise);
    });
    return Promise.all(promises).then(function () { });
};
exports.deleteAuthHeaders = function () {
    authHeaderKeys.forEach(function (key) {
        delete axios_1.default.defaults.headers.common[key];
    });
};
exports.deleteAuthHeadersFromDeviceStorage = function (Storage) {
    var promises = [];
    authHeaderKeys.forEach(function (key) {
        var promise = Storage.removeItem(key);
        promises.push(promise);
    });
    return Promise.all(promises).then(function () { });
};
exports.getUserAttributesFromResponse = function (userAttributes, response) {
    var invertedUserAttributes = utility_1.invertMapKeysAndValues(userAttributes);
    var userAttributesBackendKeys = Object.keys(invertedUserAttributes);
    var userAttributesToReturn = {};
    Object.keys(response.data.data).forEach(function (key) {
        if (userAttributesBackendKeys.indexOf(key) !== -1) {
            userAttributesToReturn[invertedUserAttributes[key]] = response.data.data[key];
        }
    });
    return userAttributesToReturn;
};
//# sourceMappingURL=auth.js.map