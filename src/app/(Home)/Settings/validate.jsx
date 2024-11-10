// validate.js or formValidation.js

export const validate = (formData) => {
    const errors = {};
      
    if (!formData.usernameSt) {
      errors.usernameSt = 'Username is required';
    } else if (formData.usernameSt.length > 15) {
      errors.usernameSt = 'Username must be 15 characters or less';
    } else if (formData.usernameSt.length < 2) {
      errors.usernameSt = 'Username must be at least 2 characters';
    }
  
    if (!formData.currentPasswordSt) {
      errors.currentPasswordSt = 'Current Password is required';
    } 
  
    if (!formData.newPasswordSt) {
      errors.newPasswordSt = 'New password is required';
    } else if (formData.newPasswordSt.length < 6) {
      errors.newPasswordSt = 'Password must be at least 6 characters';
    }
  
    if (!formData.confirmPasswordSt) {
      errors.confirmPasswordSt = 'Confirm password is required';
    } else if (formData.confirmPasswordSt !== formData.newPasswordSt) {
      errors.confirmPasswordSt = 'Passwords do not match';
    }
    // console.log(errors);
    return errors;
};
