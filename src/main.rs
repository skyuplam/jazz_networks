use rug::{Integer, Assign};
use std::cmp::Ordering;

// #1 Sum first 100 even values from Fibonacci sequence
//
// The original Fibonacci sequence is
// f(n) = f(n - 1) + f(n - 2), where n >= 2
// As can see from the pattern of the sequence,
// f(0) = 1
// f(1) = 1
// f(2) = 2  even
// f(3) = 3
// f(4) = 5
// f(5) = 8  even
// f(6) = 13
// f(7) = 21
// f(8) = 34 even
//
// Even value happens in every third element as odd + odd = even!
// We can express the Fibonacci sequence function as the following
// f(n + 3) = f(n + 2) + f(n + 1)
//          = f(n + 1) + f(n) + f(n) + f(n - 1),        (expending both terms)
//          = f(n) + f(n - 1) + f(n) + f(n) + f(n - 1), (expending f(n + 1))
//          = 3 * f(n) + 2 * f(n - 1)
// As long as we know f(n) and f(n - 1), we can get the next even number
fn sum_even_fib(limit: u32) -> Integer {
    let mut n1 = Integer::from(1);  // f(n - 1)
    let mut n = Integer::from(2);   // f(n)
    let mut sum = Integer::from(0);
    let mut count = 0;

    // Avoid unnecessary allocation
    let mut n3 = Integer::new();
    let mut buffer = Integer::new();

    while count < limit {
        buffer.assign(&sum);
        sum.assign(&n + &buffer);

        // f(n + 3) = 3 * f(n) + 2 * f(n - 1)
        buffer.assign(2 * &n1);
        n3.assign((3 * &n) + &buffer);

        // The next n1 value is f(n + 2) = f(n + 1) + f(n) = 2 * f(n) + f(n - 1)
        buffer.assign((2 * &n) + &n1);
        n1.assign(&buffer);
        // The next n value is f(n + 3), i.e. n3
        n.assign(&n3);

        count += 1;
    }

    sum
}

// #2 Find the intersection between 2 sorted arrays and return an array of unique numbers
#[allow(dead_code)]
fn intersect_arrays(a1: &[i32], a2: &[i32]) -> Vec<i32> {
    let mut i = 0;
    let mut j = 0;

    let mut result: Vec<i32> = Vec::new();

    while i < a1.len() && j < a2.len() {
        match a1[i].cmp(&a2[j]) {
            Ordering::Less => i += 1,
            Ordering::Greater => j += 1,
            Ordering::Equal => {
                match result.last() {
                    Some(last_num) => {
                        // Check if it is already in the list
                        if *last_num != a1[i] {
                            result.push(a1[i]);
                        }
                    },
                    // Push when no last
                    None => result.push(a1[i]),
                }
                i += 1;
                j += 1;
            },
        }
    }

    result
}

// #3 Find odd digit from positive integer and return true if there is no odd digit,
// otherwise false
//
// Convert the positive integer into string and loop over the char to see if any odd
#[allow(dead_code)]
fn has_no_odd_digit(int: u32) -> bool {
    let int: String = int.to_string();
    for c in int.chars() {
        if let Some(digit) = c.to_digit(10) {
            if digit % 2 != 0 {
                return false;
            }
        }
    }
    true
}

// #4 when passed a decimal digit X, returns the value of X+XX+XXX+XXXX
// E.g. if the supplied digit is 3 it should return 3702
//
// x + xx + xxx + xxxx = 1 * x * 1000 + 2 * x * 100 + 3 * x * 10 + 4 * x
//                     = (1000 + 200 + 30 + 4) * x
//                     = 1234 * x
#[allow(dead_code)]
fn calc_digit(x: u32) -> u32 {
    1234 * x
}

fn main() {
    let result = sum_even_fib(100);
    println!("Sum first 100 even-valued Fibonacci numbers: {}", result);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sum_event_fib() {
        assert_eq!(sum_even_fib(1), 2);
        assert_eq!(sum_even_fib(2), 10);
        assert_eq!(sum_even_fib(3), 44);
        assert_eq!(sum_even_fib(4), 188);
        assert_eq!(sum_even_fib(5), 798);
        assert_eq!(sum_even_fib(6), 3382);
        assert_eq!(sum_even_fib(7), 14328);
    }

    #[test]
    fn test_intersect_arrays() {
        let a1 = [1, 1, 1, 2, 3, 3, 3, 4, 4, 5, 5, 5];
        let a2 = [2, 2, 2, 3, 3, 4, 4, 6, 6, 6, 6, 7, 7, 7, 7, 7];
        let expected = [2, 3, 4];
        let actual = intersect_arrays(&a1, &a2);
        assert_eq!(&actual[..], &expected[..]);

        let a1 = [];
        let a2 = [2, 2, 2, 3, 3, 4, 4, 6, 6, 6, 6, 7, 7, 7, 7, 7];
        let expected: [i32; 0] = [];
        let actual = intersect_arrays(&a1, &a2);
        assert_eq!(&actual[..], &expected[..]);

        let a1 = [1, 1, 1, 1];
        let a2 = [1, 1, 1, 1];
        let expected = [1];
        let actual = intersect_arrays(&a1, &a2);
        assert_eq!(&actual[..], &expected[..]);

        let a1 = [];
        let a2 = [];
        let expected: [i32; 0] = [];
        let actual = intersect_arrays(&a1, &a2);
        assert_eq!(&actual[..], &expected[..]);
    }

    #[test]
    fn test_has_no_odd_digit() {
        assert_eq!(has_no_odd_digit(0), true);
        assert_eq!(has_no_odd_digit(1), false);
        assert_eq!(has_no_odd_digit(2), true);
        assert_eq!(has_no_odd_digit(10), false);
        assert_eq!(has_no_odd_digit(20), true);
    }

    #[test]
    fn test_calc_digit() {
        assert_eq!(calc_digit(3), 3702);
        assert_eq!(calc_digit(0), 0);
        assert_eq!(calc_digit(1), 1 + 11 + 111 + 1111);
        assert_eq!(calc_digit(5), 5 + 55 + 555 + 5555);
        assert_eq!(calc_digit(9), 9 + 99 + 999 + 9999);
    }
}
