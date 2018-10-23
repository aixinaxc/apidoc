import htmlDocx from 'html-docx-js/dist/html-docx.js';
const uuid = function () {
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "";

    let u = s.join("");
    return u;
};

const time10 = function () {
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    return timestamp;
};

const formatDateTime = function (timeStamp) {
    let date = new Date();
    date.setTime(timeStamp * 1000);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
};

const getObjectURL = function (file) {
    var url = null;
    if (window.createObjcectURL != undefined) {
        url = window.createOjcectURL(file);
    } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
};


const h2d = function (content) {
    let c = htmlDocx.asBlob(content);
    console.log("h2d:");
    console.log(c);
    blob2File(c,c.type)
};

const blob2File= function (value, type) {
    let blob;
    if (typeof window.Blob == "function") {
        blob = new Blob([value], {type: type});
    } else {
        var BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
        var bb = new BlobBuilder();
        bb.append(value);
        blob = bb.getBlob(type);
    }
    let URL = window.URL || window.webkitURL;
    let bloburl = URL.createObjectURL(blob);
    location.href = bloburl;
}


export default {
    uuid, time10, formatDateTime,getObjectURL,h2d
}