/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
	// Application Constructor
	initialize : function() {
		this.bindEvents();
		
		
	},
	


	
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// `load`, `deviceready`, `offline`, and `online`.
	bindEvents : function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
		document.getElementById('scan').addEventListener('click', this.scan, false);
		document.getElementById('add').addEventListener('click', this.add, false);
			document.getElementById('manual').addEventListener('click', this.enterISBN, false);
						document.getElementById('library').addEventListener('click', this.library, false);
							
	},

	// deviceready Event Handler
	//
	// The scope of `this` is the event. In order to call the `receivedEvent`
	// function, we must explicity call `app.receivedEvent(...);`
	onDeviceReady : function() {
		app.receivedEvent('deviceready');
	},



	enterISBN : function() {
		$('#content').empty();
		inputer = '<input type="text" autocomplete="off" name="isbn" id="isbn"></input><p><button href="#" data-role="button" data-theme="a" onClick="app.manual();" id="searcher">Search</button></p>';
		$('#enterISBN').html(inputer).slideDown('slow');
		
			$.mobile.activePage.trigger('create');
	},
	// Update DOM on a Received Event
	receivedEvent : function(id) {
		var parentElement = document.getElementById(id);
		var listeningElement = parentElement.querySelector('.listening');
		var receivedElement = parentElement.querySelector('.received');

		listeningElement.setAttribute('style', 'display:none;');
		receivedElement.setAttribute('style', 'display:block;');

		console.log('Received Event: ' + id);
	},

	scan : function() {
		
		console.log('scanning');

		var scanner = cordova.require("cordova/plugin/BarcodeScanner");

		scanner.scan(function(result) {
			var ISBN = result.text;

			$.ajax({//call to login webservice
				url : "https://www.googleapis.com/books/v1/volumes?q=isbn:" + ISBN,
				type : "GET",
				dataType : 'json',

			}).done(function(response) {//success

				for (var i = 0; i < response.items.length; i++) {
					var item = response.items[i];

					// in production code, item.text should have the HTML entities escaped.
					document.getElementById("content").innerHTML = "<div id='title'>" + item.volumeInfo.title + "</div><div id='author'>" + item.volumeInfo.authors + "</div><div id='thumb'>" + item.id + "</div><div id='date'>" + item.volumeInfo.publishedDate + "</div><div id='description'>" + item.volumeInfo.description + "</div><div id='isbn'>" + item.volumeInfo.industryIdentifiers[1].identifier + "</div><div id='subject'>" + item.volumeInfo.categories + "</div>";
				}
			});

			console.log("Scanner result: \n" + "text: " + result.text + "\n" + "format: " + result.format + "\n" + "cancelled: " + result.cancelled + "\n");
			document.getElementById("info").innerHTML = result.text;
			

		}, function(error) {
			console.log("Scanning failed: ", error);
		});
	},
	
	add : function () {
		
		title = document.getElementById("title").innerHTML;
		author = document.getElementById("author").innerHTML;
		subject = document.getElementById("subject").innerHTML;
		description = document.getElementById("description").innerHTML;
		isbn = document.getElementById("isbn").innerHTML;
		thumb = document.getElementById("thumb").innerHTML;
		date = document.getElementById("date").innerHTML;

		$.ajax({//call to books add webservice
				url : "http://www.seeward.com/books_app_add.php",
				type : "GET",
				dataType : 'html',
				data : {
					name : title,
					author : author,
					description : description,
					subject : subject,
					isbn : isbn,
					thumb : thumb,
					date : date
				},
			}).done(function(response) {//success
					alert(response);
			
			});
		
	},
	
	manual : function () {
		search = $('#isbn').val();
			$('#enterISBN').empty();
		
		
		$.ajax({//call to login webservice
				url : "https://www.googleapis.com/books/v1/volumes?q=isbn:" + search,
				type : "GET",
				dataType : 'json',

			}).done(function(response) {//success

				for (var i = 0; i < response.items.length; i++) {
					var item = response.items[i];

					// in production code, item.text should have the HTML entities escaped.
					document.getElementById("content").innerHTML = "<div id='title'>" + item.volumeInfo.title + "</div><div id='author'>" + item.volumeInfo.authors + " " + "</div><div id='thumb'>" + item.id + "</div><div id='date'>" + item.volumeInfo.publishedDate + "</div><div id='description'>" + item.volumeInfo.description + "</div><div id='isbn'>" + item.volumeInfo.industryIdentifiers[1].identifier + "</div><div id='subject'>" + item.volumeInfo.categories + "</div>";
				}
			});
		
	},
	
	displayBooks : function() {
		
			Storage.prototype.getObject = function(key) {
		var value = this.getItem(key);
		return value && JSON.parse(value);
	};
	
	library = window.localStorage.getObject('books');
	var template = $('#libraryList').html();

				var html = Mustache.to_html(template, library);
				$('#content').html(html);
				$.mobile.activePage.trigger('create');
				
	},


	details : function(id) {
		var isbn2 = id;
		
		Storage.prototype.getObject = function(key) {
		var value = this.getItem(key);
		return value && JSON.parse(value);
	};
		
		result = window.localStorage.getObject('books');
			
			var details;
			$.each(result.items, function(i, obj) {
			
				if(obj.ISBN == isbn2)
				details = obj;
				
			
			});
			
			all = {
				"item" : details
			};
			
				var template = $('#detailList').html();

				var html = Mustache.to_html(template, all);
				$('#content').html(html);
				$.mobile.activePage.trigger('create');
				
			
	},
	
	library : function () {
		

		$.ajax({//call to login webservice
				url : "http://www.seeward.com/books_app.php",
				type : "GET",
				dataType : 'json',

			}).done(function(response) {//success
				
				var all = { "items" : response };
				Storage.prototype.setObject = function(key, value) {
		this.setItem(key, JSON.stringify(value));
	};
				window.localStorage.setObject("books", all);
				
				app.displayBooks();
			});
	},
	encode : function() {
		var scanner = cordova.require("cordova/plugin/BarcodeScanner");

		scanner.encode(scanner.Encode.TEXT_TYPE, "http://www.nhl.com", function(success) {
			alert("encode success: " + success);
		}, function(fail) {
			alert("encoding failed: " + fail);
		});

	}
};



