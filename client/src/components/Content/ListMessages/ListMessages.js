import React from 'react';
import {
  Row, Col, Tooltip, Comment, Avatar,
} from 'antd';
import PropTypes from 'prop-types';

import moment from 'moment';
import Linkify from 'react-linkify';

import { getUserName, getUserPic } from 'utils/SlackUtils';

import './ListMessages.css';

// TODO :  Combine messages' from same auther only
// if they are sent in a span of given time, starting from first message from same author
const ListMessages = ({ room, canGroup, message }) => {
  if (message === undefined) return false;

  const {
    id, senderId, text, createdAt,
  } = message;
  const time = (
    <Tooltip title={moment(createdAt).format('MMM D, YYYY [at] hh:mm:ss A')}>
      <small>{moment(createdAt).format('hh:mm A')}</small>
    </Tooltip>
  );

  const author = getUserName(room, senderId);
  const avatar = getUserPic(room, senderId);

  return canGroup ? (
    <Row className="grouped-message" key={id}>
      <Col span={1} style={{ width: '55px' }}>
        {time}
      </Col>
      <Col span={21}>
        <span className="message-text">{text}</span>
      </Col>
    </Row>
  ) : (
    <Comment
      key={id}
      author={(
        <div className="message-sender">
          {author}
          &nbsp;
          {time}
        </div>
      )}
      avatar={<Avatar src={avatar} alt={author} />}
      content={(
        <span className="message-text">
          <Linkify properties={{ target: '_blank' }}>{text}</Linkify>
        </span>
      )}
    />
  );
};

ListMessages.propTypes = {
  room: PropTypes.object.isRequired,
  canGroup: PropTypes.bool.isRequired,
  message: PropTypes.object.isRequired,
};

export default ListMessages;
