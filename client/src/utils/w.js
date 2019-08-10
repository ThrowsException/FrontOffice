import wretch from "wretch";

export default wretch().catcher(401, err => window.location.assign("/login"));
