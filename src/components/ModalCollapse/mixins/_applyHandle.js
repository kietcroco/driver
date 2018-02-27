export default function () {

	if (this.props.onChange) {

		const { labels, values } = this._getSubmit();
		
		this.props.onChange(labels.join(this.props.labelSeparate), values);
	}
};