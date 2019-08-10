import wretch from "wretch";

export default wretch().catcher(401, () => window.location.assign("/login"));
