'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserData = exports.AuthCache = undefined;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _nodeCache = require('node-cache');

var _nodeCache2 = _interopRequireDefault(_nodeCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AuthCache {

  static get DEFAULT_TTL() {
    return 300;
  }

  static _generateKeyHash(username, password) {
    const sha = _crypto2.default.createHash('sha256');
    sha.update(JSON.stringify({ username: username, password: password }));
    return sha.digest('hex');
  }

  constructor(logger, ttl) {
    this.logger = logger;
    this.ttl = ttl || AuthCache.DEFAULT_TTL;

    this.storage = new _nodeCache2.default({
      stdTTL: this.ttl,
      useClones: false
    });
    this.storage.on('expired', (key, value) => {
      if (this.logger.trace()) {
        this.logger.trace(`[gitlab] expired key: ${key} with value:`, value);
      }
    });
  }

  findUser(username, password) {
    return this.storage.get(AuthCache._generateKeyHash(username, password));
  }

  storeUser(username, password, userData) {
    return this.storage.set(AuthCache._generateKeyHash(username, password), userData);
  }
}

exports.AuthCache = AuthCache; // Copyright 2018 Roger Meier <roger@bufferoverflow.ch>
// SPDX-License-Identifier: MIT

class UserData {

  get username() {
    return this._username;
  }
  get groups() {
    return this._groups;
  }
  set groups(groups) {
    this._groups = groups;
  }

  constructor(username, groups) {
    this._username = username;
    this._groups = groups;
  }
}
exports.UserData = UserData;
//# sourceMappingURL=authcache.js.map