import Swal from 'sweetalert2/src/sweetalert2';
import '@sweetalert2/theme-dark/dark.css';
import { mutate } from 'swr';

import './styles.css';
import { axiosUtil } from '../axiosinstance';

const getAlert = () => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    background: '#000',
    timerProgressBar: true,
    onOpen: toast => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
  return Toast;
};

export const triggerAlert = data => {
  const toast = getAlert();
  toast.fire(data);
};

export const deleteTrigger = accountno => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    background: '#000',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3363dd',
    confirmButtonText: 'Yes, delete it!',
  }).then(result => {
    if (result.value) {
      axiosUtil.delete('deleteaccount', { data: { accountno } }).then(() => {
        mutate(`allaccounts`);
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
          background: '#000',
          confirmButtonColor: '#3363dd',
        });
      });
    }
  });
};

export default getAlert;
