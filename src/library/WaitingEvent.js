"use strict";
import md5 from 'crypto-js/md5';

const _data = {
	dispatched: new Map(),
	handle: new Map()
};

const WaitingEvent = Object.freeze({

	addEventListener( eventName, handle, context, isDynamic = false ) {

		if( !eventName || typeof handle !== "function" ) {

			throw `Event error`;
		}

		context = context || handle;

		// nếu chưa có danh sách event name thì tạo list mới
		if( !_data.handle.has( eventName ) ) {

			_data.handle.set(eventName, []);
		}

		// lấy danh sách handle
		var listHandle = _data.handle.get( eventName );

		// nếu là dynamic thì tạo key để xoá nếu trùng
		var key = undefined;
		if( isDynamic ) {

			key = (context.displayName || context.name || context.constructor && context.constructor.name || "") + (handle.name || "") + handle.toString();
			key = md5(key);

			let i = listHandle.findIndex( item => (item.isDynamic && item.key === key) );
			if( i !== -1 ) {

				listHandle.splice(i,1);
			}
		}

		// thêm handle mới
		listHandle.push({
			handle,
			context,
			isDynamic,
			key
		});

		// check nếu có event thì xử lý
		if( _data.dispatched.has( eventName ) ) {

			let listEvent = _data.dispatched.get( eventName );
			listEvent.forEach( eventArgs => {

				listHandle.forEach( item => {

					item.handle.apply( item.context, eventArgs );
				} );
			} );

			_data.dispatched.delete( eventName );
		}

		return {
			remove: () => {

				WaitingEvent.removeEventListener(eventName, handle, context, isDynamic);
			}
		};
	},

	removeEventListener( eventName, handle, context, isDynamic = false ) {

		if( !eventName || typeof handle !== "function" ) {

			throw `Event error`;
		}

		// nếu có list event
		if( _data.handle.has( eventName ) ) {

			context = context || handle;
			let listHandle = _data.handle.get( eventName );

			// nếu là dynamic thì tìm theo key
			let key = undefined;
			if( isDynamic ) {

				key = (context.displayName || context.name || context.constructor && context.constructor.name || "") + (handle.name || "") + handle.toString();
				key = md5(key);
				
				let i = listHandle.findIndex( item => (item.isDynamic && item.key === key) );
				if( i !== -1 ) {

					listHandle.splice(i,1);
					return true;
				}
				return false;
			}

			let i = listHandle.findIndex( item => (!item.isDynamic && item.handle === handle && item.context === context) );
			if( i !== -1 ) {

				listHandle.splice(i,1);
				return true;
			}

		}		
		return false;
	},

	dispatch( eventName, event ) {

		if( !eventName ) {

			throw `Event error`;
		}

		var args = Array.from(arguments).slice(1);

		if( _data.handle.has( eventName ) ) {

			let listHandle = _data.handle.get( eventName );
			listHandle.forEach( item => {

				item.handle.apply( item.context, args );
			} );

			return listHandle;
		}

		if( !_data.dispatched.has( eventName ) ) {

			_data.dispatched.set(eventName, []);
		}

		_data.dispatched.get( eventName ).push( args );
		return args;
	}
});

export default WaitingEvent;