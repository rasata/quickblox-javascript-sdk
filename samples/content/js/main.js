QB.init(QBApp.appId, QBApp.authKey, QBApp.authSecret, true);

$(document).ready(function(){

QB.createSession(QBUser, function(err, result) {
	var token = result.token;
		user_id = result.id;
		uploadPages = 0;
		filesCount = 0;
		finished = false;

	if (err) { 
		console.log('Something went wrong: ' + err);
	} else {
		console.log('Session created with id ' + result.id);

		uploadingFiles(token);

		// uploading files scroll event
		$(window).scroll(function() {
			if  ($(window).scrollTop() == $(document).height() - $(window).height())
			{
				uploadingFiles(token);
			}
		});

		// loading image click event
		$("#loading-btn").click(function(e){
			e.preventDefault();

			var inputFile = $("input[type=file]")[0].files[0];
			console.log(inputFile);
				if (inputFile) {
					$("#progress").show(0);
				}
			// uploading image
			QB.content.createAndUpload({name: inputFile.name, file: inputFile, type: inputFile.type, size: inputFile.size, 'public': true}, function(err, response){
				if (err) {
					console.log(err);
				} else {
					console.log(response);	
					$("#progress").fadeOut(400);

					var uploadedFile = response;

					insertImage(uploadedFile.id, uploadedFile.name, token, false);
				}
			});

		});
	}
});
});
// add images
function insertImage(fileId, fileName, token, toAppend){
	var imageHTML = "<img src='http://api.quickblox.com/blobs/"+fileId+"/download.xml?token="+token+"' alt='"+fileName+"' class='animals img-responsive col-md-4 col-sm-6 col-xs-12' />";
	if (toAppend) {
		$('#pictures').append(imageHTML);
		console.log(token);
	} else {
		$('#pictures').prepend(imageHTML);
	}
}
// get content files
function uploadingFiles(token) {
	if (finished != true) {
		$("#loadwnd").show(0);
		uploadPages = uploadPages + 1;

		QB.content.list({page: uploadPages, per_page: '9'}, function(error, response) {
		$.each(response.items, function(index, item){
			var cur = this.blob;

			insertImage(cur.id, cur.name, token, true);
		});
			if (error) {
				console.log(error);
			} else {
				console.log(response);
				$("#loadwnd").delay(1000).fadeOut(1000);
			}
			
			var totalEntries = response.total_entries;
				entries = response.items.length;
				filesCount = filesCount + entries;

			if (filesCount >= totalEntries) {
				finished = true;
			}
		});
	}
}