const checkIfChildEmail = (email) => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b\s+(.*)/;
    
    // Find the email address and random characters in the string
    return email.match(emailRegex);

  }

export default checkIfChildEmail;