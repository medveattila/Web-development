//mindig kell a backenden validationt csinálni, mert a frontend kód könnyen felülírható! na meg van amit ott nem is lehetne

function isEmpty(value) {
  return !value || value.trim() === ""; //ez akkor ad vissza igazat, ha vagy nincs megadva érték, vagy csak whitespace van beírva (a trim levágja a szóközöket)
}

function userCredentialsAreValid(email, password) {
  return (
    email && //ez akkor ad vissza igazat ha ezek mind teljesülnek, tehát van email, jelszó, stb
    email.includes("@") &&
    password &&
    password.trim().length >= 6
  );
}

function userDetailsAreValid(email, password, name, street, postal, city) {
  return (
    userCredentialsAreValid(email, password) &&
    !isEmpty(name) &&
    !isEmpty(street) &&
    !isEmpty(postal) &&
    !isEmpty(city)
  );
}

function emailIsConfirmed(email, confirmEmail) {
  return email === confirmEmail; //akkor ad vissza igazat, ha megegyeznek; ===: tartalom és típus is, ==: csak tartalom
}

module.exports = {
  userDetailsAreValid: userDetailsAreValid,
  emailIsConfirmed: emailIsConfirmed,
};
