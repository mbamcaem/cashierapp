export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// module.exports = function(x) {
//     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// };
