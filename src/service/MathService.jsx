import * as math from 'mathjs';

export function docProduct(a, b) {
    const r = a.abs() * b.abs();
    const phi = a.arg() + b.arg();

    return math.complex({ r, phi });
}
