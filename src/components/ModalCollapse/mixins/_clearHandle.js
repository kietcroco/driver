import uncheckAll from '../utils/uncheckAll';
import autoCheck from '../utils/autoCheck';

export default function() {

	let dataSource = this._dataSource.slice();

	dataSource = uncheckAll( dataSource );
	dataSource = autoCheck( dataSource, [], this.props.multiple );

	this.setState({
		dataSource: this.state.dataSource.cloneWithRows( dataSource )
	});

	this._dataSource = dataSource;

	!this.props.multiple && this._applyHandle();
};