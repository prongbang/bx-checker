document.addEventListener('DOMContentLoaded', function() {

    let key = "bxswitch"

    let switchTag = document.querySelector('#bxswitch');

    let checked = localStorage.getItem(key);

    if(checked != undefined) {
        switchTag.checked = +checked == 1 ? true : false;
        console.log("checked:", checked)
    } else {
        localStorage.setItem(key, 1);
    }

    switchTag.addEventListener('click', function(e) {
        console.log("click switch: ", switchTag.checked)
        localStorage.setItem(key, switchTag.checked ? 1 : 0);

    }, false);
}, false);