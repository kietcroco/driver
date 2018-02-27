/**
 * @flow
 * @todo: static class Registry của reducer
 * @author: Croco
 * @since: 8-2-2017
 * @export
  * ReducerRegistry: Object
*/

"use strict";
import { combineReducers } from 'redux';
import { persistReducer, persistCombineReducers } from 'redux-persist'
import { AsyncStorage } from 'react-native';

const DEFAULT_CONFIGS = {
	key: "root",
	storage: AsyncStorage,
	persistCombine: true,
	whitelist: []
};

class ReducerRegistry {

	constructor( configs = {} ) {

		this.configs = {
			...DEFAULT_CONFIGS,
			...configs
		};

		this._data = {
			reducers: {}, // danh sách reducer
			configPersistReducers: {}, // danh sách configPersistReducers
			emitChange: [] // danh sách hanlde change
		};
	}

	/**
	 * @todo: Hàm đăng ký reducer
	 * @author: Croco
	 * @since: 9-2-2017
	 * @params:
	  * key: String = path reducer
	  * reducer: Function = reducer redux
	  * configPersistReducer: Boolean | Object https://github.com/rt2zz/redux-persist
	 * @return Object: { path: path reducer, reducer: reducer redux }
	*/
	register = (key: String, reducer: Function, configPersistReducer = false) => {

		if (!key || !reducer) return this;

		// config persist
		if (configPersistReducer && this.configs.persistCombine) {

			if (configPersistReducer === true) {

				configPersistReducer = {};
			}
			configPersistReducer = {
				key,
				storage: this.configs.storage,
				whitelist: [key],
				...configPersistReducer
			};
			this.configs.whitelist = [
				...this.configs.whitelist,
				...configPersistReducer.whitelist
			];

			this._data.configPersistReducers[key] = configPersistReducer;
			reducer = persistReducer(configPersistReducer, reducer);
		}

		reducer.$$typeOf = key;
		reducer.$$type = "reducer";
		reducer.$$key = key;
		reducer.typeOf = () => key;
		
		this._data.reducers[key] = reducer;

		if (this._data.emitChange.length) {

			let i;
			for (i in this._data.emitChange) {

				this._data.emitChange[i] 
					&& this._data.emitChange[i](key, reducer, configPersistReducer);
			}
		}

		return reducer;
	};

	getReducers = (key: String) => {

		if (key) return this._data.reducers[key];

		if (!Object.keys(this._data.reducers).length) {
			return;
		}

		if( this.configs.persistCombine ) {

			return persistCombineReducers(this.configs, this._data.reducers);
		}

		return combineReducers(this._data.reducers);
	};

	getConfigPersistReducers = (key: String) => {

		if (key) return this._data.configPersistReducers[key];

		return this._data.configPersistReducers;
	};

	/**
	 * @todo: Hàm đăng ký sự kiện change reducer
	 * @author: Croco
	 * @since: 9-2-2017
	 * @params:
	  * listener: Function = handle xử lý
	*/
	addChangeListener = (listener: Function) => {

		if (typeof listener !== "function") {

			throw new Error('set listener ReducerRegistry error.');
		}
		listener.remove = () => this.removeChangeListener(listener);

		this._data.emitChange.push(listener);

		return listener;
	};

	/**
	 * @todo: Hàm huỷ sự kiện change reducer
	 * @author: Croco
	 * @since: 9-2-2017
	 * @params:
	  * listener: Function = handle xử lý
	*/
	removeChangeListener = (listener: Function) => {

		let index = this._data.emitChange.indexOf(listener);
		if (index !== -1) {

			delete this._data.emitChange[index];
		}

		return this;
	};
};

export default ReducerRegistry;