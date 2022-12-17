# Project 2

Web Programming with Python and JavaScript

The files were grouped in project2.zip
(Having issues with git when creating branches, all previous uploads automatically moves here.)

The website was codenamed Chatio:

This contains the following files

root folder: 
	1. application.py file - Main Python file for the app
	2. Readme.md - This file you are currently reading
	3. requirements.txt - the requirements needed to run app
	4. static folder - container css folder which contains - style.css 
		4b. static folder - contains the js file. - main.js



1. Personal touch: I added two personal touch to the app.
	1a. First: The ability for users to know who is online 
	1b. The ability for users to see who left a room and who joined a room
	1c. The ability for users to know which group they currently are.

2. The layout is quite simple and the logic of the site goes thus;
	2a - On load (Logic Checks if you are new and a modal pops to assign you a user name)
		2aa - This username is then sanitized and stored in my server side for reference
		2ab - This information is broadcast to all within the network
	2b - On login - Users are shown preset channels and can add more as required, added channels would update and broadcast to all.
	2c - Users can join any channels are messages are stored on the server side so they can be recalled by user.
	2b - Both username and Selected groups are stored at the client side (localstorage) for easy recall. this is used to assign where new users are taken.
3. All the requirements as specified were meant and can be seen in the video file.


Last thought!

SocketIO was great albeit with limitations when used without a database.
An authentication system would help solve some obvious issues using localstorage posses.
