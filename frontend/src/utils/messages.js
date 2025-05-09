import { toast } from 'react-toastify';

export const showSuccess = (msg = "Success!") => {
  toast.success(msg, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    pauseOnHover: true,
    theme: "light"
  });
};

export const showError = (msg = "Something went wrong!") => {
  toast.error(msg, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    pauseOnHover: true,
    theme: "colored"
  });
};

export const showInfo = (msg = "Heads up!") => {
  toast.info(msg, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: true,
    pauseOnHover: true,
    theme: "dark"
  });
};
