export default function(e) {

	this._restore();
	this.props.backHandle && this.props.backHandle(e);
};