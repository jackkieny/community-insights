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

export const loginToSkool = async (skoolEmail: string, skoolPassword: string) => {
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

export const getCommunities = async () => {
    const response = await fetch('/api/getcommunities', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    const data = await response.json();
    return data;
}

export const handleSaveCommunity = async (communityId: string) => {
  await fetch('/api/savecommunity', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      'communityId': communityId,
    }),
  })
}

export const handleRefreshCommunities = async (
  refreshToggle: boolean,
  setRefreshToggle: (refreshToggle: boolean) => void,
  setLoadingVisible: (loadingVisible: boolean) => void,
) => {
  setLoadingVisible(true);

  await fetch('/api/refreshcommunities', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  })

  setLoadingVisible(false);
  setRefreshToggle(!refreshToggle);
}