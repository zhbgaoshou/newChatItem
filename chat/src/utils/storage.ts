export function setStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStorage(key: string) {
  if (localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key) || "");
  } else return;
}

export function removeStorage(key: string) {
  localStorage.removeItem(key);
}
