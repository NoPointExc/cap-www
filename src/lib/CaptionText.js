
var DiffLib = require("diff")
const MAX_HISTORY_LENGTH = 15;

const PERIODS = [",", ".","!", "?", "，", "。", "！", "？"];


function formatTimeStamp(num) {
    // Output: hh:mm:ss,uuu

    // TODO Fix the bug. 00:00:63,060 should be 00:01:03,060
    // hh:mm:ss E.g 00:00:00
    const intSec = parseInt(num);
    const intMs = parseInt(1000 * (num - intSec));
    const intMin = parseInt(intSec / 60);
    const intHrs = parseInt(intMin / 60);

    const hh = ("00" + intHrs).substr(-2);
    const mm = ("00" + intMin % 60).substr(-2);
    const ss = ("00" + intSec % 60).substr(-2);
    const uuu = ("000" + intMs).substr(-3);
    return `${hh}:${mm}:${ss},${uuu}`;

    // const int = ("000000" + String(parseInt(num))).substr(-6);

    // const s = `${int.substr(0, 2)}:${int.substr(2, 2)}:${int.substr(4, 2)}`;

    // // E.g 440
    // const dec = Math.round((num % 1) * 10000) / 10000;
    // const ms = dec === 0? "000" : (dec + "000").substr(2,3);

    // // E.g
    // //00:00:00,440
    // return `${intSec},${ms}`;
}

class TimedChar {
    constructor(char, start_time, end_time){
        this.char = char;
        this.start_time = start_time;
        this.end_time = end_time;
    }

    getChar() {
        return this.char;
    }
}

class TimeRange {
    constructor (start_time, end_time) {
        this.start_time  = start_time;
        this.end_time = end_time;
    }

    toText() {
        return `${formatTimeStamp(this.start_time)} --> ${formatTimeStamp(this.end_time)}`;
    }
}


export default class CaptionText {


    constructor(transcriptJSON, maxLineSize) {

        this.transcript_obj = JSON.parse(transcriptJSON);
        this.transcriptText = this.transcript_obj.results.transcripts[0].transcript;
        //this.previous_transcript_text = null;

        // For undo. The last element is the current version
        this.preTranscriptTextArray = [];
        // For redo. The last element is the 1st "next" version
        this.nextTranscriptTextArray = [];

        this.timeline = [];
        this.timeRanges = [];

        let previous_start_time = 0;
        let previous_end_time = 0;
        this.previous_removed_timeline = [];

        // init timeline
        let lineSize = 0;
        for (let i = 0; i < this.transcript_obj.results.items.length; i++) {
            // split all item into timestamp/character
            const item = this.transcript_obj.results.items[i];
            const content = (item.alternatives && item.alternatives.length > 0) ? item.alternatives[0].content : "";
            const start_time = item.start_time || previous_start_time;
            const end_time = item.end_time || previous_end_time;


            for (let j = 0; j < content.length; j++) {
                this.timeline.push(new TimedChar(content.charAt(j), start_time, end_time));
                previous_start_time = start_time;
                previous_end_time = end_time;
                lineSize++;
            }

            // Decouple this in a method. I may need to implement a different split approach.
            // Insert \n for new line when
            // 1) exceed the max line length
            // 2) not the last line
            if (this.newLineIfPeriod(content) ||
                (lineSize > maxLineSize && i < this.transcript_obj.results.items.length - 1)) {
                this.timeline.push(new TimedChar("\n", start_time, end_time));
                //reset
                lineSize = 0;
            }
        }
        this.transcriptText = "";
        for (let i = 0; i < this.timeline.length; i++) {
            this.transcriptText += this.timeline[i].getChar();
        }

        this.transcriptText.trim();

        this.updateTimeRange();
    }

    newLineIfPeriod(content) {
        if (content) {
            return PERIODS.includes(content);
        }
        return false;
    }

    getTimeRange(lineNum) {
        if (this.timeRanges[lineNum]) {
            return this.timeRanges[lineNum].toText();
        }
        return "unknown";
    }

    getText() {
        return this.transcriptText;
    }

    getJobName() {
        return this.transcript_obj.jobName || "unnamed";
    }

    undo() {
        console.log(this.preTranscriptTextArray);
        const previous = this.preTranscriptTextArray.pop();

        if (previous) {
            this.nextTranscriptTextArray.push(previous);
            this.updateWithoutHistory(previous, this.transcriptText);
            return true;
        }

        return false;
    }

    redo() {
        const next = this.nextTranscriptTextArray.pop();
        if (next) {
            this.update(next);
            return true;
        }
        return false;
    }

    update(newTranscriptText) {
        // Update text statuses.
        const preTranscriptText = this.transcriptText;
        this.preTranscriptTextArray.push(preTranscriptText);
        if (this.preTranscriptTextArray.length > MAX_HISTORY_LENGTH) {
            this.preTranscriptTextArray = this.preTranscriptTextArray.slice(-MAX_HISTORY_LENGTH);
        }


        this.updateWithoutHistory(newTranscriptText, preTranscriptText);
    }

    updateWithoutHistory(newTranscriptText, preTranscriptText) {
        this.transcriptText = newTranscriptText;

        // the diffs array example:
        // 0: Object {count: 4, value: "今天这是"}
        // 1: Object {count: 5, added: undefined, removed: true, value: "的欧地址了"}
        // 2: Object {count: 5, added: true, removed: undefined, value: "低油低脂，"}
        // 3: Object {count: 6, value: "适合运动减肥"}
        // 4: Object {count: 1, added: true, removed: undefined, value: "。"}
        // 5: Object {count: 11, value: "这是牛腿上那种那叫花条"}
        // 6: Object {count: 1, added: true, removed: undefined, value: "。"}
        // Array Prototype
        const diffs = DiffLib.diffChars(preTranscriptText, this.transcriptText);

        this.updateTimeline(diffs);
        this.updateTimeRange();
    }

    updateTimeline(diffs) {
        // Take diffs get from the "diff" lib and update the timestamp for all changes.
        // 1. Using the timestamp from the previous char when adding new char.
        // 2. Keep the timestamp when replacing old char with new char.
        // 3. No timestamp change for all other cases.
        if (diffs === null || diffs.length < 1) {
            console.warn("diff array can not be empty or null!");
            return;
        }

        let applied_len = 0;
        let removed_timeline = [];

        for (let k =0; k < diffs.length; k++) {
            let diff = diffs[k];
            if (diff.added) {
                // *added*
                let to_add = [];
                for(let i = 0; i < diff.count; i++) {
                    if (this.previous_removed_timeline.length > 0) {
                        // *replacement*: when there are removed. We consider the "added" as the
                        // replacement of the previous "removed".
                        to_add.push(
                            new TimedChar(
                                diff.value.charAt(i),
                                this.previous_removed_timeline[0].start_time,
                                this.previous_removed_timeline[0].end_time,
                            ),
                        );
                        // cancel the 1st TimedChar as the replacement of to_added
                        this.previous_removed_timeline.splice(0, 1);
                    } else {
                        // *new adding*: set the timestamp to be same as the previous
                        if (k !== 0) {
                            to_add.push(new TimedChar(diff.value.charAt(i), this.timeline[applied_len-1].start_time, this.timeline[applied_len-1].end_time));
                        } else {
                          // 1st character. Set time to be 0.
                          to_add.push(new TimedChar(diff.value.charAt(i), "0", "0"));
                        }
                    }
                }

                this.timeline.splice(applied_len, 0, ...to_add);

            } else if (diff.removed) {
                // removed
                for(let j = 0; j < diff.count; j++) {
                    removed_timeline.push(this.timeline[applied_len]);
                    this.timeline.splice(applied_len, 1);
                }
            } else {
                // unchanged
                applied_len += diff.count;
            }
        }

        this.previous_removed_timeline = removed_timeline;
    }


    updateTimeRange() {
        let timeRanges = [];
        const lines = this.getText().split("\n");
        let j = 0; // Index of the 1st char in each line

        for (let i = 0; i < lines.length; i++) {
            let lineLen = lines[i].length;
            timeRanges.push(
                new TimeRange(
                    this.timeline[j] ? this.timeline[j].start_time : -1, // TODO undefined
                    this.timeline[j + lineLen - 1] ? this.timeline[j + lineLen - 1].end_time : -1,
                )
            );

            j += lineLen + 1
        }
        this.timeRanges = timeRanges;
    }

    exportAsSrt(skipPeriod) {
        const lines = this.getText().split("\n");
        // UTF-16 encoding. Required for Chinese characters. See also:
        // https://stackoverflow.com/questions/31959487/utf-8-encoidng-issue-when-exporting-csv-file-javascript
        let srt = "\uFEFF";
        for (let i =0; i < lines.length; i++) {
            const time = this.timeRanges[i].toText();
            let line = lines[i];
            if (skipPeriod) {
                PERIODS.forEach(period => {
                    line = line.replaceAll(period, " ")
                });
            }
            srt += `${i+1}\n${time}\n${line}\n\n`;
        }
        return srt;
    }

}
