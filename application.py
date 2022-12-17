import os, re
import requests
from time import localtime, strftime
from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit, send, join_room, leave_room

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)



## For Testing Limit
debug = True
message_limit = 100

# Rooms and User 
rooms = ["general", "soccer", "tennis", "coding"]
users = []
online_users = []
user_id = {}



messages = {"general":[], "soccer":[], "tennis":[], "coding":[] }



# Test the User Limit here
if debug:
	rooms.append("limit-test")
	messages["limit-test"] = []
	for i in range (99):
		messages ["limit-test"].append(["I am just checking the limit", "doNROBOT" + str(i+1), "2020 01:10AM"])

else:
	messages = {}



# CLean up strings from user information
def sanitized_information(zone):
    has_spaces = re.sub(r'[^a-zA-Z0-9 ]+','', zone)
    hyphenated = '-'.join(has_spaces.split())
    lower = hyphenated.lower()

    return lower


#Initial Page and List of rooms on load
@app.route("/", methods=['GET', 'POST'])
def index():

	return render_template("index.html", rooms=rooms, users=users)




#Socket for all message
@socketio.on ('message')
def message(data):

# Delete line late
	message = data ['msg']
	username = data ['username']
	time_stamp = strftime('%b-%d %I:%M%p', localtime() )
	room = data ['room']
	room_clean = room.replace(" ", "")
	saveinfo = [message, username, time_stamp]
	if len(messages[room_clean]) >= message_limit:
            messages[room_clean].pop(0)
	messages[room_clean].append(saveinfo)

# Delete line, done for debugging purpose
	print (f"\n\n{data}\n\n")

	send({'msg': data['msg'], 'username': data['username'], 'time_stamp':strftime('%b-%d %I:%M%p', localtime() )}, room=data['room'])
	emit('some-event', 'this is a custom event message')


#Socket for Joining channels and what should happen
@socketio.on('join')
def join(data):
	room_joined = data['room']
	room_clean = room_joined.replace(" ", "")
	for saveinfo in messages[room_clean]:
		message = saveinfo[0]
		username = saveinfo[1]
		time_stamp = saveinfo[2]
		emit ("old message",{"messages": message, "username": username, "time_stamp": time_stamp})
	# Information on joining sent out to existing room users
	join_room(data['room'])
	send({'msg': data['username']  + " just joined" + data['room'] + "room."}, room=data['room'])

#Socket when users leave a room
@socketio.on ('leave')
def leave(data):
	leave_room(data['room'])
	send({'msg': data['username']  + " just Left" + data['room'] + "room."}, room=data['room'])



#Create new rooms here
@socketio.on("new_room")
def new_message(data):
	clean_room = sanitized_information(data['room_create'])
	if clean_room not in rooms:
		rooms.append(clean_room) 
		messages[clean_room] = []
		emit ("new room",{"room":clean_room}, broadcast=True)


#SID Request 
@socketio.on("add user")
def new_user(data):
	username = data['username']
	clean_user = sanitized_information(data['username'])
	if clean_user not in users:
		users.append(clean_user)
		online_users.append(clean_user)
		user_id[request.id] = username
	#	user_id[clean_user].append(sid_request)
		# user_ui = user_id[sid_request]
			
	emit("welcome username", {"username": username})


#broadcast login
@socketio.on("welcome user")
def user_login(data):
	username = data['username']
	clean_user = sanitized_information(data['username'])
	if clean_user not in online_users:
		online_users.append(clean_user) 
		emit("welcome again", {"username": online_users}, broadcast=True)


#Broadcast logout
@socketio.on("exit chat")
def chat_exit(data):
	username = data['username']
	clean_user = sanitized_information(data['username'])
	online_users.remove(clean_user) 

	emit("welcome again", {"username": online_users}, broadcast=True)







if __name__ == '__main__':
    socketio.run(app, debug=True)