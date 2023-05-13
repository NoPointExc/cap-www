// import {transcriptJSON} from "./Constants";
export default class S3 {

    upload_to_presigned_url(file, signedPost) {
        const formData = new FormData();
        Object.keys(signedPost.fields).forEach(key => {
            formData.append(key, signedPost.fields[key]);
        });

        formData.append("file", file);
        fetch(
            signedPost.url,
            {
                method: "POST",
                body: formData,
            }
        ).then(
            res => console.log(res),
        ).catch((error) => {
            console.log(error);
            throw error;
        });
    }

    async upload(file) {

        let username = localStorage.getItem("username");

        if (!username) {
            // User has not log-in yet.
            alert("Login is required for this uploading.");
        }
        // 1. request for presigned url
        console.log("File name: " + file["name"]);

        let path = null;
        try {
            const response = await fetch(
                `${process.env.REACT_APP_DOMAIN}/api/video/get_upload_url`,
                {
                    method: "POST",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify({"file_name": file["name"]}),
                    credentials: "include",
                }
            );
            const result = await response.json();
            console.log(result);
            if (result.url) {
                // 2. Upload to presigned_url
                this.upload_to_presigned_url(file, result.url);
                path = `s3://${result.path_to_file}`;
            } else if (result.error_msg) {
                console.log(result.error_msg);
                throw result.error_msg;
            } else {
                let error_msg = `Unexpected error when request for authorized upload URL.
                    Please reach out to product supports for help if you see this again.`;
                console.log(error_msg);
                throw error_msg;
            }

            console.log("******************************");
            console.log(path);
            console.log("******************************");
        } catch (error) {
            console.log(`Failed to upload with error: ${error}`);
            throw error;
        }

        return path;
    }

    async download(url) {
        console.log(`downloading from ${url}`);
        const response = await fetch(url, {method: "GET"});
        const transcriptJSON = await this._readableStreamToStr(response.body);
        return transcriptJSON;
    }

    async _readableStreamToStr(readable) {
        console.log("Reading readableStream");
        const utf8Decoder = new TextDecoder("utf-8");

        const reader = readable.getReader();
        let result = "";
        let allDone = false;
        try {
            while (!allDone) {
                let {value: chunk, done: chunkDone} = await reader.read();
                console.log(`Reading chunk with done = ${chunkDone}`);
                chunk = chunk ? utf8Decoder.decode(chunk, {stream: true}) : "";
                result += chunk;
                allDone = chunkDone;
            }
        } catch (error) {
            console.log(`Failed to read the readableStream with error ${error}`);
            throw error;
        } finally {
            if (!reader.closed) {
                await reader.cancel();
            }
            console.log("reading down");
        }

        console.log(`Got ${result.length} bytes of string from readable`);
        return result;
    }

}
