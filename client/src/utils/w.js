import wretch from "wretch";

export default wretch().catcher(401, () => {
  document.cookie = "logged_in= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.assign("/login");
});
