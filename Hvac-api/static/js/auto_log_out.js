
const time_period = 30;
auto_logout = () =>{

    /*
        This function checks to see if the page is idle,
        if after 1 minute the page is still idel it calls the
        timerIncrement() function unless the idleTime is reset.

    */

    setInterval(timerIncrement, 60000); // 1 minute
    $(this).mousemove(function (e) {    // Zero the idle timer on mouse movement.
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });
}

let idleTime = 0;
timerIncrement = () =>{
    /*
        Increment the timer every one minute then after 30 minutes
        Log the user out.
    */
    idleTime += 1;
    if (idleTime > time_period) {
        document.getElementById("logout_Button").click();
    }
}
