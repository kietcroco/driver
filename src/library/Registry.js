/**
 * @flow
*/
"use strict";
const Registry = function Registry(iterable) {

	// khởi tạo phương thức
	const instance = new Map(iterable);
	instance.__proto__ = Registry.prototype.__proto__;

	// mảng handle
	const events = new Map();

	// hàm set
	instance.set = function set(key, value) {

		// lấy value củ
		const oldValue = instance.get( key );
		Registry.prototype.set.apply(instance, [key, value]);

		// nếu value củ khác value mới
		if( oldValue !== value ) {

			// kiểm tra event change của key
			if (events.get("change").get("Entries").has(key)) {

				// lấy danh sách event theo key
				const entry = events.get("change")
					.get("Entries")
					.get(key)
				;

				// dispatch event change
				entry.forEach(handle => typeof handle === "function" && handle(value, key));
			}

			// dispatch event change tất cả
			events.get( "change" )
					.get("All")
					.forEach( handle => typeof handle === "function" && handle(value, key) )
			;
		}
	};

	// hàm xoá
	instance.clear = function clear() {
		Registry.prototype.clear.apply(instance, []);
		
		// dispatch event
		events.get("clear").forEach( handle => typeof handle === "function" && handle() );
	};

	instance.delete = function ( key ) {

		Registry.prototype.delete.apply(instance, [key]);

		// kiểm tra event delete của key
		if( events.get( "delete" ).get("Entries").has( key ) ){

			// lấy danh sách event theo key
			const entry = events.get( "delete" )
								.get("Entries")
								.get( key )
			;

			// dispatch event delete
			entry.forEach( handle => typeof handle === "function" && handle(key) );
		}

		// dispatch event delete tất cả
		events.get( "delete" )
				.get("All")
				.forEach( handle => typeof handle === "function" && handle(key) )
		;

	};

	// hàm remove, init sự kiện
	instance.removeAllEventListener = function removeAllEventListener() {
		
		// mảng handle change
		const eventChanges = new Map();
		eventChanges.set("All", new Set()); // danh sách handle change tất cả
		eventChanges.set("Entries", new Map()); // danh sách handle change theo key

		// mảng handle delete
		const eventDeletes = new Map();
		eventDeletes.set("All", new Set()); // danh sách handle delete tất cả
		eventDeletes.set("Entries", new Map()); // danh sách handle delete theo key

		// gán 3 handle vào mảng sự kiện
		events.set("change", eventChanges);
		events.set("clear", new Set());
		events.set("delete", eventDeletes);
	};

	// init 3 event chính: change, clear, delete
	instance.removeAllEventListener();

	// xoá sự kiện
	instance.removeEventListener = function removeEventListener( eventName, key, handle ) {

		// nếu không có event name báo lỗi
		if( !events.has( eventName ) ) {

			throw `Missing event name ${ eventName }`;
		}

		// nếu là sự kiện xoá tất cả
		if( eventName === "clear" ) {

			// nếu không tìm thấy handle, báo lỗi
			if( typeof key !== "function" ) {

				throw `Missing event handle ${ eventName }`;
			}

			// kiểm tra nếu sự kiện này được đăng ký
			if( events.get("clear").has( key ) ) {

				events.get("clear").delete( key );
				return true;
			}
			return false;
		}

		// nếu không tìm thấy handle, báo lỗi
		if( !handle && typeof key !== "function" ) {

			throw `Missing event handle ${ eventName }`;
		}

		// nếu không có key thì add key là tất cả
		if( !handle && typeof key === "function" ) {

			handle = key;
			key = "All";

			// check lỗi
			if( events.get( eventName ).has( key ) ) {

				throw `Missing event handle ${ key }`;
			}
			
			if( events.get( eventName ).get( key ).has( handle ) ) {

				events.get( eventName ).get( key ).delete( handle );
				return true;
			}

			return false;
		}

		// nếu có key
		if( key !== undefined && typeof handle === "function" ) {

			// lấy danh sách sự kiện theo key
			const entry = events.get( eventName ).get("Entries");

			// kiểm tra key này có đăng ký danh sách sự kiện nào chưa
			if( entry.has( key ) ) {

				if( entry.get(key).has( handle ) ) {

					entry.get(key).delete( handle );
					return true;
				}
			}

			return false;
		}
	};

	// thêm sự kiện
	instance.addEventListener = function addEventListener( eventName, key, handle ) {

		let entry;

		// nếu không có event name báo lỗi
		if( !events.has( eventName ) ) {

			throw `Missing event name ${ eventName }`;
		}

		// nếu là sự kiện xoá tất cả
		if( eventName === "clear" ) {

			// nếu không tìm thấy handle, báo lỗi
			if( typeof key !== "function" ) {

				throw `Missing event handle ${ eventName }`;
			}

			entry = events.get("clear");
			// nếu sự kiện đã được thêm rồi thì xoá sự kiện cũ
			if( entry.has( key ) ) {

				entry.delete( key );
			}

			// thêm 1 sự kiện xoá
			entry.add( key );
			return {
				remove: () => instance.removeEventListener( eventName, key )
			};
		}

		// nếu không tìm thấy handle, báo lỗi
		if( !handle && typeof key !== "function" ) {

			throw `Missing event handle ${ eventName }`;
		}

		// nếu không có key thì add key là tất cả
		if( !handle && typeof key === "function" ) {

			handle = key;
			key = "All";

			entry = events.get( eventName );

			// check lỗi
			if( entry.has( key ) ) {

				throw `Missing event handle ${ key }`;
			}

			entry = entry.get( key );
			
			// nếu sự kiện đã được thêm rồi thì xoá sự kiện cũ
			if( entry.has( handle ) ) {

				entry.delete( handle );
			}

			// add thêm sự kiện vào tất cả
			entry.add( handle );
			return {
				remove: () => instance.removeEventListener( eventName, handle )
			};
		}
		
		// nếu có key
		if( key !== undefined && typeof handle === "function" ) {

			// lấy danh sách sự kiện theo key
			entry = events.get( eventName ).get("Entries");

			// kiểm tra key này có đăng ký danh sách sự kiện nào chưa
			if( !entry.has( key ) ) {

				// nếu chưa tạo danh sách mới
				entry.set( key, new Set() );
			}

			entry = entry.get( key );

			// nếu sự kiện đã được thêm rồi thì xoá sự kiện cũ
			if( entry.has( handle ) ) {

				entry.delete( handle );
			}

			// add thêm 1 sự kiện vào
			entry.add( handle );
			return {
				remove: () => instance.removeEventListener( eventName, key, handle )
			};
		}
	};

	return instance;
};
Registry.__proto__ = Map;
Registry.prototype.__proto__ = Map.prototype;

// const Registry = new Registry();

export default Registry;