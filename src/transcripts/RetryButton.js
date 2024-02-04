import { RetryIcon } from '../Icons';
import { DOMAIN } from "../lib/Config";


export default function RetryButton(props) {
    const handleOnRetry = async () => {
        const url = `${DOMAIN}/workflow/retry?id=${props.id}`;
        const rsp = await fetch(
            url,
            {
                method: "POST",
                credentials: "include"
            },
        ).then(response => response.json())
        .catch((error) => {
            console.log(`Failed to delete workflow with: ${url} and error: ${error}`);
        });
        // TODO implement this.
    };

    return <a href="#" onClick={handleOnRetry}>
        {RetryIcon}
    </a>;
};