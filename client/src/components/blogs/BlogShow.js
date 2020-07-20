import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBlog } from '../../actions';

class BlogShow extends Component {
	componentDidMount() {
		this.props.fetchBlog(this.props.match.params._id);
		console.log(this.props);
	}
	renderImage() {
		if (this.props.blog.imageUrl) {
			return <img src={'https://modibo-sanogo-1234.s3.ca-central-1.amazonaws.com/' + this.props.blog.imageUrl} alt={this.props.blog.imageUrl} className="materialboxed" width="450px" />;
		}
	}

	render() {
		if (!this.props.blog) {
			return '';
		}
		console.log(this.props.blog);
		const { title, content } = this.props.blog;

		return (
			<div>
				<h3>{title} 222</h3>
				<p>{content} 2222</p>
				{this.renderImage()}
			</div>
		);
	}
}

function mapStateToProps({ blogs }, ownProps) {
	return { blog: blogs[ownProps.match.params._id] };
}

export default connect(mapStateToProps, { fetchBlog })(BlogShow);
