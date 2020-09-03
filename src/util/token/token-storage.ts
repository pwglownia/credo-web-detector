const TOKEN_KEY = "token";
function createTokanStorage() {
  function save(tokane: string) {
    localStorage.setItem(TOKEN_KEY, tokane);
  }
  function get() {
    return localStorage.getItem(TOKEN_KEY);
  }
  function remove() {
    localStorage.removeItem(TOKEN_KEY);
  }
  return { save, get, remove };
}

export const TokenStorage = createTokanStorage();
