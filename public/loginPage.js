'use strict';



const userForm = new UserForm();

userForm.loginFormCallback = data => {
  console.log(data);
  loginUser(data);
}

userForm.registerFormCallback = data => {
  console.log(data);
  registerUser(data);
}


function loginUser({login, password}) {
  ApiConnector.login({login, password}, response => {
    if (response.success === false) {
      console.error(response.error);
      userForm.setLoginErrorMessage(response.error);
    } else {
      location.reload();
    }
  });
}

function registerUser({login, password}) {
  ApiConnector.register({login, password}, response =>
      location.reload()
  );
}





