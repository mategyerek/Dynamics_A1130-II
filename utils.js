/*
A file reserved for global utilities shared across applets
*/

function rms(a, b) { // fastest 2d root mean square according to current benchmarks, should be used everywhere
    return (a * a + b * b) ** 0.5;
}
