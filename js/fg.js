



document.addEventListener("deviceready", onDeviceReady2, false);
function onDeviceReady2() {  
    
    //Config Plugin
    var config = {
        app_id      : '497374793682261',
        secret      : '07b09b255ccffb77f69fa5a8f85e8ab3',
        scope       : 'publish_stream,email',
        host        : 'http://mobiwaiter.co.za/fb.php', //App Domain ( Facebook Developer ).
        onLogin     : _onLogin,
        onLogout    : _onLogout
    };
    
    //Login Facebook
    $(document).FaceGap(config);
    //Logout Facebook
    //$(document).FaceGap('logout');
    
    //Callback Login
    function _onLogin( event ){     
        alert('status > '+event.status); // 1 - success, 0 - error
        alert('data > '+event.data); //Object response (id, name, email, etc);
        alert('token > '+event.token); // token user login
        alert('message > '+event.message);  
    }
    
    //Callback Logout
    function _onLogout( event ){
        alert('status > '+event.status); // 1 - success, 0 - error
        alert('message > '+event.message);
    }   
}