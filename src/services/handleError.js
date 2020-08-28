const handleError = (error, function1) => {
  if (error.status === 498) {
    localStorage.removeItem('token');
    function1(null);
  } else if (error.status) function1({ icon: 'error', title: error.body });
};

export default handleError;
