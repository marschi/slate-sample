import React from 'react';
import axios from 'axios';
import invariant from 'invariant';
import classnames from 'classnames';
import { } from './styles.scss';
import { Icon, noop } from '../helpers';

export default class LinkPreview extends React.PureComponent {

  static propTypes = {
    link: React.PropTypes.string.isRequired
  }

  state = {
    err: false,
    previewData: null,
    loading: true
  }

  componentDidMount() {
    this.fetchPreview(this.props.link);
  }

  componentWillReceiveProps({ link }) {
    if (this.props.link !== link) {
      this.fetchPreview(link);
    }
  }

  fetchPreview(link){
    axios.get(`api/link-preview/${encodeURIComponent(link)}`)
      .then(({ status, data }) => {
        invariant(status === 200, 'Request status unequal to 200');
        this.setState({ previewData: data, err: false, loading: false });
      }).catch(err => this.setState({ previewData: {}, err, loading: false }))
  }

  render() {
    const { loading, err, previewData } = this.state;
    if (err) return null;
    const {
      loadFailed,
      title,
      description,
      mediaType,
      images,
      videos,
      audios
    } = previewData || {};
    const { link, isFocused, onClickClose } = this.props;

    if (loadFailed) return null;

    return (
      <LinkPreviewView {...{ loading, title, description, link, images, onClickClose}} />
    )
  }
}

const LinkPreviewView = ({ isFocused, loading, title, description, link, images = [], onClickClose = noop }) => {

  if (loading) {
    return (
      <div className="card link-preview">...</div>
    )
  }

  return (
    <div className={classnames('link-preview', { 'is-focused': isFocused })}>
      <span onClick={e => e.preventDefault() || onClickClose()} className="close-button">
        <Icon type="times" />
      </span>
      <div className="link-text-box">
        <h4>{title}</h4>
        <p>{description}</p>
        <p className="link-footer">
          <small>
            <a className="text-muted"href={link}>{link}</a>
          </small>
        </p>
      </div>
      {!!images.length &&
        <div
          className="preview-img"
          style={{backgroundImage: `url(${images[0]})`}}
        />
      }
    </div>
  );
}
