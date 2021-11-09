const authHeader = () => {
  // const token = localStorage.getItem("token");

  // CAMBIAR ESTO POR 1 TOKEN EN EL LOCAL STORAGE SIMPLE
  const token = localStorage.getItem("persist:root");
  const p1 = JSON.parse(token).user;
  const p2 = JSON.parse(p1).user.jwtToken;

  if (token) {
    return { Authorization: `Bearer ${p2}` };
  } else {
    return {};
  }
};

export { authHeader };
