var landing = new Landing('Choose an option', 'section',
    function() {
        landing.hide();
        register.show();
    },
    function() {
        landing.hide();
        login.show();
    });

document.body.appendChild(landing.element);

var login = new Login('Login', 'section');

document.body.appendChild(login.element);

var register = new Register('Register', 'section');

document.body.appendChild(register.element);
