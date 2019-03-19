function toCsvLine(el) {
    return `"${el._title}",${el._url},${el._subreddit}`;
}

export default function toCsv(items, header) {
    return items.reduce((acc, val) =>
        (`${acc}\n${toCsvLine(val)}`),
            header);
};
