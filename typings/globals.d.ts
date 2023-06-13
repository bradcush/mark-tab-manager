declare const ENABLE_BOOKMARK_COUNTER: boolean;
declare const ENABLE_LOGGING: boolean;
// Until bun-types can be used with dom lib because now dom
// types seem to be conflicting for language servers
declare const navigator: {
    onLine: boolean;
};
