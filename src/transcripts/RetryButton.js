import { RetryIcon } from '../Icons';
import { DOMAIN } from "../lib/Config";


export default function RetryButton(props) {
    const handleOnRetry = async () => {
        const url = `${DOMAIN}/workflow/retry?workflow_id=${props.workflow_id}`;
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
        const new_id = rsp.workflow_id;
        console.log("Create a new workflow with id " + new_id);
    };

    return <a href="#" onClick={handleOnRetry}>
        {RetryIcon}
    </a>;
};