document.addEventListener('DOMContentLoaded', () => {

        // Connect to websocket
        var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);



        //  check when user exit

  		window.onbeforeunload = function () {
		socket.emit('exit chat',{'username':localStorage.getItem('username')});
		
			}



        //

        // Set up room for new user or exisiting user
        let room = localStorage.getItem('room_selected');
    	





        if (!localStorage.getItem('room_selected')) {
        joinRoom("general");
        localStorage.setItem('room_selected', 'general');
      } else{

        joinRoom(localStorage.getItem('room_selected'))
      }

        // New Username display and set up (Remember to tweak this for further usage)

        if (!localStorage.getItem('username')) {
            var get_modal = document.getElementById("myModal");
            get_modal.style.display='block';
            get_modal.classList.add("in");
            document.querySelector('#new-user').onsubmit = () => {
            username = document.querySelector('#username-input').value
            localStorage.setItem('username', username);
            socket.emit('add user', {'username': username});
            
        };
    } else{ 
          // input a receieve socket for sID Purpose when seting up private message
          socket.emit('welcome user', {'username': localStorage.getItem('username')});
      };

            

        // Create Rooms

          document.querySelector('#create_room').onsubmit = () => {

            socket.emit ('new_room',{'room_create':document.querySelector('#room_create').value})
            document.querySelector('#room_create').value = '';

            location.reload();
            
          };

        

          // Display incoming messages
        	socket.on('message', data => {
          	const p = document.createElement('p');
          const span_timestamp = document.createElement('span');
          span_timestamp.className = 'timespan';
          const span_username = document.createElement('span');
          span_username.className = 'userspan';
          if (data.username===localStorage.getItem('username')){
          p.className = 'usermessageColor';
          
          } else{

          	p.className = 'messageColor';

          }

            if (data.username){

          span_username.innerHTML = data.username
          span_timestamp.innerHTML = data.time_stamp;
          p.innerHTML = data.msg  + span_timestamp.outerHTML + span_username.outerHTML ;
          
          document.querySelector('#display-area').append(p) ;

            } else{

                adminMsg(data.msg);

            }

          
              // for debug purpose remember to delete
          console.log(`Message received: ${data}`)
        });



            // For Signaling login and logout
         socket.on('welcome again', data => {
          	
          	var users = data.username;
          	document.querySelector('#user-display').innerHTML = '';
          	users.forEach(myLogin);


          	function myLogin(item) {
          	const p = document.createElement('p');
          	const icon = document.createElement('i');
          	icon.className = "fa fas fa-circle";
          	icon.style.color='green';
          	p.className = "onlineUser";
          	p.innerHTML = icon.outerHTML + `  ` + item;
  			document.querySelector('#user-display').append(p);
};
          	
        //  console.log(data)
        });

            // send message
          document.querySelector('#send_message').onsubmit = () => {

            socket.send({'msg':document.querySelector('#user_message').value, 'username': localStorage.getItem('username'), 'room':room});
            document.querySelector('#user_message').value = '';
            return false;
          }

                // join rooms

                document.querySelectorAll('.room-choice').forEach(p =>{
                  p.onclick = () => {
                      let newRoom = p.innerHTML;

                      if (newRoom == room){
                      		//p.className='red-color';
                            msg = `You are already in ${room} room`
                                adminMsg(msg);
                      } else {

                          leaveRoom(room);
                          joinRoom(newRoom);
                          room = newRoom;

                      }

                  }



                });

                			//testing




                  		// End trying out the private room shit
                  // leave room

                  function leaveRoom(room){
              			
              	
                    socket.emit('leave',{'room':room, 'username':localStorage.getItem('username')}); // Add user
                  }


                    function joinRoom(room){
              		
                    socket.emit('join',{'room':room, 'username':localStorage.getItem('username')}); // Add user
                    localStorage.setItem('room_selected', room);
                    document.querySelector('#room-active').innerHTML = 'You are currently in ' + room + '!';
                    document.querySelector('#display-area').innerHTML = '' //Display all old messages of the group



                  }

                        // What to receive when users joinn



                          socket.on('old message', data => {
                          const p = document.createElement('p');
                      //      const br = document.createElement('br');
                            const span_timestamp = document.createElement('span');
                            const span_username = document.createElement('span');
                            span_timestamp.className = 'timespan';
          					span_username.className = 'userspan';
          					if (data.username===localStorage.getItem('username')){
					          p.className = 'usermessageColor';
					          
					          } else{

					          	p.className = 'messageColor';

					          }

                              if (data.username){

                            span_username.innerHTML = data.username
                            span_timestamp.innerHTML = data.time_stamp;
                            p.innerHTML = data.messages + span_timestamp.outerHTML + span_username.outerHTML ;
                            
                            document.querySelector('#display-area').append(p) ;

                              } else{

                                  adminMsg(data.msg);

                              }

                            

                            console.log(`Message received: ${data}`)
                          });



                          // End what happens






                      // print  system message
                      function adminMsg (msg){

                        const p = document.createElement('p');
                        p.innerHTML = msg;
                        document.querySelector('#display-area').append(p);

                      }

































    });



