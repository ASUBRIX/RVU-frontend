// Simple holder for confirmationResult (not serializable)
let confirmationResult = null;
export const setConfirmationResult = (result) => { confirmationResult = result; };
export const getConfirmationResult = () => confirmationResult;
