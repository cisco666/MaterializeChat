//Notification.requestPermission();
$(document).ready(function() {
	var socket = io.connect();
	$('#modal1').openModal();
	$("#messageChat").submit(function(event) {
		event.preventDefault();

		if($("#message").val().length > 1){
			socket.emit("newMessage", {"message" : $("#message").val()});
			$("#message").val("");
		}
	});	

	$("#addUser").click(function(){
		if($("#userName").val().length > 1){
			socket.emit("addUser", {"username" : $("#userName").val()});
			$('#modal1').closeModal();
		}
	});

	socket.on("resMessage", function(data){
		if($(window).blur()){
			//notification();
		}
		console.log(data);
		$("#mesageContent").append('<strong>'+ data.username +'</strong>.- <span>' + data.message + "</span><br><br>");
	});
});

/*function notification() {
	var options = {
		body: "Tienes un nuevo mensaje",
	    icon: 'https://pbs.twimg.com/profile_images/2674085790/a9e8b9e0657a6485549d690e527de99f_400x400.jpeg'
	};
	var myNotification = new Notification("Nuevo Check", options);
}*/