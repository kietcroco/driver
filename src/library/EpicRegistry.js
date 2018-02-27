/**
 * @flow
 * @todo: static class Registry của epic
 * @author: Croco
 * @since: 10-1-2018
 * @export
  * EpicRegistry: Object
*/

"use strict";
import { combineEpics } from 'redux-observable';
import 'rxjs';

const DEFAULT_CONFIGS = {};

class EpicRegistry {

	constructor( configs = {} ) {

		this.configs = {
			...DEFAULT_CONFIGS,
			...configs
		};

		this._data = {
			epics: {}, // danh sách epic
			configEpic: {}, // danh sách config epic
			emitChange: [] // danh sách hanlde change
		};
	}

	/**
	 * @todo: Hàm đăng ký epic
	 * @author: Croco
	 * @since: 10-1-2018
	 * @params:
	  * key: String = name epic
	  * epic: Function = epic redux observable
	  * config: Boolean | Object
	 * @return epic
	*/
	register = (key: String, epic: Function, config = false) => {

		if (!key || !epic) return this;

		epic.$$typeOf = key;
		epic.$$type = "epic";
		epic.$$key = key;
		epic.typeOf = () => key;
		
		this._data.epics[key] = epic;

		if (this._data.emitChange.length) {

			let i;
			for (i in this._data.emitChange) {

				this._data.emitChange[i] 
					&& this._data.emitChange[i](key, epic, config);
			}
		}

		return epic;
	};

	getEpics = (key: String) => {

		if (key) return this._data.epics[key];

		if ( !Object.keys(this._data.epics).length ) {
			return;
		}

		// var epics = [];
		// for (let k in this._data.epics) {
		// 	epics.push(this._data.epics[k]);
		// }
		return combineEpics(...Object.values(this._data.epics));
	};

	getConfigEpics = (key: String) => {

		if (key) return this._data.configEpic[key];

		return this._data.configEpic;
	};

	/**
	 * @todo: Hàm đăng ký sự kiện change epic
	 * @author: Croco
	 * @since: 10-1-2018
	 * @params:
	  * listener: Function = handle xử lý
	*/
	addChangeListener = (listener: Function) => {

		if (typeof listener !== "function") {

			throw new Error('set listener epic error.');
		}
		listener.remove = () => this.removeChangeListener(listener);

		this._data.emitChange.push(listener);

		return listener;
	};

	/**
	 * @todo: Hàm huỷ sự kiện change epic
	 * @author: Croco
	 * @since: 10-1-2018
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

export default EpicRegistry;