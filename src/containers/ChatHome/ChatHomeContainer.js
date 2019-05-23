import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { uniqBy, filter } from 'lodash';
import { Layout } from 'antd';

import ChatKit from '../../Chatkit';
import ChatHome from '../../components/ChatHome';
import { subscribeToRoom } from '../../utils/ChatKitUtil';
const {
    Header, Content, Footer, Sider,
} = Layout;

export default class ChatHomeContainer extends Component {
    state = {
        chatkitReady: false,
        user        : {},
        room        : null,
        rooms       : [],
        messages    : {},
        error       : null
    }

    actions = {
        connected: rooms => this.setState({ rooms, chatkitReady: true }),
        isTyping: () => {
            console.log("isTyping");
        },
        notTyping: () => {
            console.log("notTyping");
        },
        subscribeToRoom: rooms => {
            console.log("Subscribe/added to room");
            // Add room in rooms array and then remove duplicates.
            let allRooms = uniqBy([...this.state.rooms, rooms], function (room) { return room.id; });

            this.setState({ rooms: allRooms })
            // Subscribe current user to newly created room to receive new messages
            subscribeToRoom(this.state.user, rooms.id, {
                onMessage: this.actions.addMessage
            })
        },
        removedFromRoom: room => {
            // Remove room from rooms array
            this.setState({ rooms: [...filter(this.state.rooms, (eachRoom) => eachRoom.id !== room.id)] })
        },
        setUserPresence: () => {
            console.log("setUserPresence");
            //setUserPresence doesnt cause re-render so we forcefully update the view
            this.forceUpdate()
        },
        addMessage: payload => {
            const roomId = payload.room.id
            const messageId = payload.id
            // Update local message cache with new message
            this.setState(prevState => ({
                messages: {
                    ...prevState.messages,
                    [roomId]: {
                        ...prevState.messages[roomId],
                        [messageId]: payload
                    }
                }
            }))
        },
        setUser: user => {
            this.setState({ user })
        },
        joinRoom: room => {
            // Set current room
            this.setState({ room })
        },
        roomDeleted: room => {
            // Remove room from rooms list
            this.actions.removedFromRoom(room)
        }
    }

    componentDidMount() {
        // TODO : Check if .env file is missing? and handle error accordingly
        ChatKit(JSON.parse(localStorage.getItem("slack")).googleId, this.actions);
    }

    render() {
        if (!JSON.parse(localStorage.getItem("slack")).googleId)
            return <Redirect to="/login" />

        let { room, rooms, user, messages } = this.state;

        return (
            <ChatHome
                user     = {user}
                rooms    = {rooms}
            />
        )
    }
}