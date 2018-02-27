export default function() {

	this._backupSource = JSON.parse( JSON.stringify( this._dataSource ) );
};