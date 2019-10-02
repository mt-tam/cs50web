# --------------- MODULES --------------- #

import os
import requests
import datetime

from flask import Flask, render_template, request, url_for, jsonify, redirect
from flask_socketio import SocketIO, emit


# --------------- SET UP APP --------------- #

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


# --------------- DATA STRUCTURE --------------- #

# 'Message' DICT >> 'messages' LIST >> 'Channel' DICT >> 'Channels' LIST

# - Channels = [channel, channel, etc.]

# - Channel = {
#              "name" = ...,
#              "messages" = [message, message, etc.],
#           }

# - Message = {
#              "content" = ...,
#              "user" = ...,
#              "time" = ...,
#           }


# Store a list of channels on the server (messages will be inside)
channels = []


# --------------- INDEX --------------- #

@app.route("/")
def index():
    return render_template("index.html")


# --------------- CREATE CHANNEL --------------- #

@app.route("/create_channel", methods=["POST"])
def create_channel():
    channel = {
        "name": request.form.get("channel").strip(),
        "messages": [],
    }
    channels.append(channel)
    print(f"Channel created: | {channel['name']} |")
    return ("200")


# --------------- SHOW CHANNEL LIST --------------- #

@app.route("/channel_list")
def channel_list():
    print(f"Channel list: {channels}")
    return jsonify(channels)


# --------------- SHOW CHANNEL PAGE --------------- #

@app.route("/channel/<string:channel>")
def show_channel(channel):
    print(f"Selected channel: | {channel} |")

    # Check if channel exists
    channel_exists = False

    for i in channels:
        if channel == i["name"]:
            channel_exists = True

    if channel_exists:
        return render_template("channel.html", channel=channel)
    else:
        print("Channel doesn't exist")
        return ("<h1>Channel doesn't exist</h1><script>document.addEventListener('DOMContentLoaded', () => {localStorage.setItem('last_channel', '');});</script>")


# --------------- SAVE NEW MESSAGES & BROADCAST TO ALL USERS --------------- #

@socketio.on("message sent")
def message(data):

    # Gather all message relevant information
    message = {
        "content": data["message"],
        "user": data["user"],
        "time": data["datetime"],
    }

    # Find the right channel to add the message into
    channel = data["channel"].strip()
    print(f"Received message for channel | {channel} |")

    for i in channels:

        # If channel exists, add the new message to the channel's messages
        if channel == i["name"]:

            # Check if messages are over 100
            if len(i['messages']) == 100:

                # Remove oldest message from list
                i['messages'].pop(0)

            # Add latest message at the end of list
            i['messages'].append(message)
            print("Message was succesfully added.")
        else:
            print("Message could not be added.")

    # Debugging Print
    print(
        f"User '{message['user']}' sent '{message['content']}' in channel '{channel}' at {message['time']}.")

    # Send last message back to all users
    emit("message received", message, broadcast=True)


# --------------- SEND MESSAGE LIST PER CHANNEL --------------- #

@app.route("/messages", methods=["POST"])
def message_list():
    # Find the right channel
    channel = request.form.get("channel").strip()
    
    for i in channels:
        if channel == i["name"]:
            return jsonify(i["messages"])
        else:
            print("Channel was not found.")
            return(error)



if __name__ == '__main__':
    socketio.run(app, debug=True)

