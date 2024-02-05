import { DownloadIcon } from '../Icons';

export default function DownloadButton(props) {
    const blob = new Blob([props.content], { type: 'text/plain' });
    const fileName = props.uuid + "." + props.format;
    return <a href={URL.createObjectURL(blob)} download={fileName} target="_blank">{DownloadIcon}</a>;
}