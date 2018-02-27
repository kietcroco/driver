/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var validate = require('./validate');
var asArray = (arg) => (Array.isArray(arg) ? arg : [arg]);

export var pipedKeyValues = (arg) => {

  if (!arg || typeof arg !== 'object') {

    throw new validate.InvalidValueError('not an Object');
  }

  return Object.keys(arg).sort().map((key) => (key + ':' + arg[key])).join('|');
};

export var latLng = (arg) => {

  if (!arg) {

    throw new validate.InvalidValueError();
  } else if (arg.lat != undefined && arg.lng != undefined) {

    arg = [arg.lat, arg.lng];
  } else if (arg.latitude != undefined && arg.longitude != undefined) {

    arg = [arg.latitude, arg.longitude];
  }
  return asArray(arg).join(',');
};

export var locations = (arg) => {

  if (
    Array.isArray(arg) 
    && arg.length == 2 
    && typeof arg[0] == 'number' 
    && typeof arg[1] == 'number'
  ) {
    arg = [arg];
  }
  return asArray(arg).map(latLng).join('|');
};

export var pipedArrayOf = (validateItem) => {

  var validateArray = validate.array(validateItem);

  return (value) => (validateArray(asArray(value)).join('|'))
};

var validateBounds = validate.object({
  south: validate.number,
  west: validate.number,
  north: validate.number,
  east: validate.number
});

export var bounds = (arg) => {

  arg = validateBounds(arg);
  return arg.south + ',' + arg.west + '|' + arg.north + ',' + arg.east;
};

export var timeStamp = (arg) => {

  if (arg == undefined) {

    arg = new Date();
  }
  if (arg.getTime) {

    arg = arg.getTime();
    // NOTE: Unix time is seconds past epoch.
    return Math.round(arg / 1000);
  }

  // Otherwise assume arg is Unix time
  return arg;
};

export var retryOptions = validate.object({
  timeout: validate.optional(validate.number),
  interval: validate.optional(validate.number),
  increment: validate.optional(validate.number),
  jitter: validate.optional(validate.number)
});
