export default function() {

	this.setState({
		dataSource: this.state.dataSource.cloneWithRows( this._backupSource )
	});
	this._dataSource = this._backupSource;
};