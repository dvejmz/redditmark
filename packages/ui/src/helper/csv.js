function toCsvLine(el) {
    return `"${el._title}",${el._url},${el._subreddit}`;
}

const toCsv = (items, header) =>
    items.reduce((acc, val) =>
        (`${acc}\n${toCsvLine(val)}`), header);

export default toCsv;
