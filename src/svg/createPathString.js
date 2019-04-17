const calcPointsOnCircle = (x1, y1, x2, y2, r) => {
    const c = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    const cos = (x2 - x1) / c;
    const sin = (y2 - y1) / c;
    const [_x1, _y1] = [r * cos, r * sin];
    const [_x2, _y2] = [(c - r) * cos, (c - r) * sin];
    return [x1 + _x1, y1 + _y1, x1 + _x2, y1 + _y2];
}

// circles = [{x: , y: , id: }, ...]
// points  = [1234243, 15321, 13456, ...] (circle.id)
// r:int
export const createPathString = (circles, points, r) => {
    if (points === undefined || points.length === 0 || circles.length === 0) return;
    return points.reduce((prev, curr, i, arr) => {
        if (i + 1 === arr.length) return prev;
        const from = circles.filter((circle) => circle.id === curr)[0];
        const to = circles.filter((circle) => circle.id === arr[i + 1])[0];
        const [x1, y1, x2, y2] = calcPointsOnCircle(from.x, from.y, to.x, to.y, r)
        return [...prev, `M${x1} ${y1}L${x2} ${y2}`];
    }, []);
}
// export const createPathString = (circles, path, r) => {
//     if (path.length === 0 || circles.length === 0) return;
//     return path.points.reduce((prev, curr, i, arr) => {
//         if (i + 1 === arr.length) return prev;
//         const from = circles.filter((circle) => circle.id === curr)[0];
//         const to = circles.filter((circle) => circle.id === arr[i + 1])[0];
//         const [x1, y1, x2, y2] = calcPointsOnCircle(from.x, from.y, to.x, to.y, r)
//         return [...prev, `M${x1} ${y1}L${x2} ${y2}`];
//     }, []);
// }