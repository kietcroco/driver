import getSubmit from '../utils/getSubmit';
import generateData from '../utils/generateData';
import shallowEqual from 'fbjs/lib/shallowEqual';

export default function() {

	let submit = getSubmit( this._dataSource, {
		delimiter: this.props.delimiter,
		separate: this.props.separate,
		labelDelimiter: this.props.labelDelimiter,
		labelSeparate: this.props.labelSeparate,
		showParent: this.props.showParent
	} );


	const values = ( submit.values && submit.values.length && submit.values ) 
				|| ( this.props.defaultValue && this.props.defaultValue.length && this.props.defaultValue )
				|| [];

	if( values.length && !shallowEqual( values, submit.values ) ) {

		let dataSource = this._dataSource.slice();

		dataSource = generateData( dataSource, values.slice(), {
			delimiter: this.props.delimiter,
			separate: this.props.separate,
			labelDelimiter: this.props.labelDelimiter,
			labelSeparate: this.props.labelSeparate,
			showParent: this.props.showParent
		} );

		submit = getSubmit( dataSource, {
			delimiter: this.props.delimiter,
			separate: this.props.separate,
			labelDelimiter: this.props.labelDelimiter,
			labelSeparate: this.props.labelSeparate,
			showParent: this.props.showParent
		} );

		this.setState({
			dataSource: this.state.dataSource.cloneWithRows( dataSource )
		});

		this._dataSource = dataSource;
	}

	return submit;
};