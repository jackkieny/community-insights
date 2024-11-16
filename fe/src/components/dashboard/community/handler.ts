export const checkIfLoggedIn = async () => {
  const response = await fetch('/api/skoollogincheck', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (response.ok) {
    const data = await response.json();
    return {
      loggedIn: true,
      userEmail: data.userEmail
    };
  }
  else {
    return {
      loggedIn: false,
      userEmail: "",
    };
  }
}

export const loginToSkool = async (skoolEmail: string, skoolPassword: string, errorMsg: string) => {
  const response = await fetch('/api/skoollogin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      'email': skoolEmail,
      'password': skoolPassword,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    return {errorMsg: ""};
  } else {
    return {errorMsg: data.error};
  }
}