const handleError = (error, function1) => {
  if (error?.error?.length)
    function1({ icon: 'error', title: error.error[0].toUpperCase() + error.error.substring(1) });
  else if (error?.message?.length) function1({ icon: 'error', title: error.message });
};

export default handleError;
