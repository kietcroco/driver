export default function(e) {
	
	this._restore();
	this.props.onRequestClose && this.props.onRequestClose(e);
};