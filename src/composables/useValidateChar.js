export default function useValidateChar() {
  const checkAcceptChar = (event) => {
    let char = String.fromCharCode(event.keyCode);
    if (/^[A-Za-z0-9_]+$/.test(char)) return true;
    else event.preventDefault();
  };

  const checkSeqChar = (str) => {
    // Check for sequential numerical characters
    for (const key in str) {
      if (+str[+key+1] == +str[key]+1 && +str[+key+2] == +str[key]+2) return false;
    }
    // Check for sequential alphabetical characters
    for (const key in str) {
      if (String.fromCharCode(str.charCodeAt(key)+1) == str[+key+1] && String.fromCharCode(str.charCodeAt(key)+2) == str[+key+2]) return false;
    }
    return true;
  };

  return {
    checkAcceptChar,
    checkSeqChar,
  };
}
