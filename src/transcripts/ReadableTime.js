
export default function ReadableTime(props) {
    // examples: "4 hours ago", "2 months ago", "20 seconds ago"
    const now = new Date();
    const ONE_HOUR_IN_MS = 3600 * 1000;
    const ONE_DAY_IN_MS = 24 * ONE_HOUR_IN_MS;
    const ONE_WEEK_IN_MS = 7 * ONE_DAY_IN_MS;
    const ONE_YEAR_IN_MS = 365 * ONE_DAY_IN_MS;
    
    const unixtime = props.unixtime;

    let readable = Math.ceil((now.getTime() - unixtime * 1000) / ONE_YEAR_IN_MS) + " years ago";
    if (now.getTime() - unixtime * 1000 < 60000) {
        readable = Math.ceil((now.getTime() - unixtime * 1000) / 1000) + " seconds ago";
    } else if (now.getTime() - unixtime * 1000 < ONE_HOUR_IN_MS) {
        readable = Math.ceil((now.getTime() - unixtime * 1000) / 60000) + " minutes ago";
    } else if (now.getTime() - unixtime * 1000 <= ONE_DAY_IN_MS + 1000) {
        readable =  Math.ceil((now.getTime() - unixtime * 1000) / ONE_HOUR_IN_MS) + " hours ago";
    } else if (now.getTime() - unixtime * 1000 <= ONE_WEEK_IN_MS + 1000) {
        readable = Math.ceil((now.getTime() - unixtime * 1000) / ONE_DAY_IN_MS) + " days ago";
    } else if (now.getTime() - unixtime * 1000 <= ONE_YEAR_IN_MS + 1000) {
        readable = Math.ceil((now.getTime() - unixtime * 1000) / ONE_WEEK_IN_MS) + " weeks ago";
    }


    return <time datetime={readable}> {readable}</time>
}