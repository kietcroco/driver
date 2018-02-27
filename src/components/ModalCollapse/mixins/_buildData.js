import generateData from '../utils/generateData';
import formatSource from '../utils/formatSource';

export default function buildData( values: Array, dataSource: Array = [] ) {

	this._dataSource = formatSource(JSON.parse( JSON.stringify( dataSource ) ), this.props.multiple, this.props.translate);

	values = ( values && values.length && values ) 
				|| ( this.props.defaultValue && this.props.defaultValue.length && this.props.defaultValue )
				|| [];
	values = JSON.parse( JSON.stringify( values ) );

	this._dataSource = generateData( this._dataSource, values.slice(), {
		delimiter: this.props.delimiter,
		separate: this.props.separate,
		labelDelimiter: this.props.labelDelimiter,
		labelSeparate: this.props.labelSeparate,
		showParent: this.props.showParent
	} );

	return this._dataSource;
};