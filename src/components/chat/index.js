import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
// import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
// import dynamicStyles from '../../style';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SendIcon from '@material-ui/icons/Send';
import { GiftedChat, InputToolbar, Bubble, Send } from 'react-web-gifted-chat';
import { data } from '../../api/data_message';

import { DYNAMIC_BREADCRUMBS } from '../../store/actions/actionTypes';

const windowHeight = window.innerHeight / 1.3;

const ChatApp = (props) => {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [contact, setContact] = useState();

  useEffect(() => {
    props.onToggleDynamicBreadcrumbs(['dashboard', 'components', 'chat']);
  }, [props]);

  const onSend = useCallback((_messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, _messages)
    );
  }, []);

  const customtInputToolbar = (input) => {
    return (
      <InputToolbar
        {...input}
        containerStyle={{
          backgroundColor: 'white',
          borderTopColor: '#E8E8E8',
          borderTopWidth: 1,
          padding: 2,
        }}
      />
    );
  };

  const renderBubble = (bubble) => {
    return (
      <Bubble
        {...bubble}
        wrapperStyle={{
          right: {
            backgroundColor: '#2196f3',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };

  const renderSend = (send) => {
    return (
      <Send {...send}>
        <div className={classes.sendingContainer}>
          <IconButton style={{ fontSize: 32, color: '#2196f3' }}>
            <SendIcon />
          </IconButton>
        </div>
      </Send>
    );
  };

  const renderChat = () => {
    return (
      <GiftedChat
        messages={messages}
        onSend={(_messages) => onSend(_messages)}
        user={{
          id: 1,
        }}
        placeholder="Type your message here..."
        renderInputToolbar={(input) => customtInputToolbar(input)}
        renderBubble={(bubble) => renderBubble(bubble)}
        renderSend={(send) => renderSend(send)}
        renderUsernameOnMessage={true}
        scrollToBottom
        alwaysShowSend
      />
    );
  };

  const setContactMessage = (user) => {
    setContact(user);
    setMessages(user.messages);
  };

  const renderChannels = () => {
    return (
      <List>
        {data.map((user, index) => (
          <ListItem button key={index} onClick={() => setContactMessage(user)}>
            <ListItemAvatar>
              <Avatar src={user.img} />
            </ListItemAvatar>
            <ListItemText primary={user.name} />
          </ListItem>
        ))}
      </List>
    );
  };

  const renderChannelsHeader = () => {
    return (
      <div className={classes.header}>
        <Typography variant="h6" color="inherit">
          Chat
        </Typography>
        <div className={classes.grow} />
        <IconButton
          // onClick={() => props.onToggleNavbarShow()}
          className={classes.buttonChat}
        >
          <MenuIcon />
        </IconButton>
      </div>
    );
  };
  const renderChatHeader = () => {
    return (
      <div className={classes.header}>
        <Typography variant="h6" noWrap>
          {contact ? contact.name : ''}
        </Typography>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.channelList}>
        {renderChannelsHeader()}
        {renderChannels()}
      </div>
      <div className={classes.chat}>
        {renderChatHeader()}
        {contact ? renderChat() : ''}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  buttonChat: {
    marginRight: theme.spacing(1),
  },
  root: {
    flex: 1,
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'row',
    height: windowHeight, //'80vh',
  },
  channelList: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  chat: {
    display: 'flex',
    flex: 3,
    flexDirection: 'column',
    borderWidth: '1px',
    borderColor: '#ccc',
    borderRightStyle: 'solid',
    borderLeftStyle: 'solid',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    paddingLeft: theme.spacing(2),
    boxShadow: theme.shadows[4],
    /*boxShadow: `0px 2px 4px -1px rgb(0,0,0,0.2),
      0px 4px 5px 0px rgba(0,0,0,0.14),
      0px 1px 10px 0px rgba(0,0,0,0.12);
    `,*/
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const mapStateToProps = (state) => ({
  dynamicStyle: state.dynamicStyle,
});

const mapDispatchToProps = (dispatch) => ({
  onToggleDynamicBreadcrumbs: (action) =>
    dispatch({ type: DYNAMIC_BREADCRUMBS, links: action }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatApp);
