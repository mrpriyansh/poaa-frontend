const handleError = (error, function1) => {
  if (error.response.status === 498) {
    localStorage.removeItem('token');
    window.location.reload();
  } else if (error.response.status) function1({ icon: 'error', title: error.response.data });
};

export default handleError;
