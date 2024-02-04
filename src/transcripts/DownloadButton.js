import { DownloadIcon } from '../Icons';

export default function DownloadButton(content, uuid, format) {
    const blob = new Blob([content], { type: 'text/plain' });
    const fileName = uuid + "." + format;
    return <a href={URL.createObjectURL(blob)} download={fileName} target="_blank">{DownloadIcon}</a>;
}