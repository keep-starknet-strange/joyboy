fn main() -> u32 {
    0
}

fn say_hi() -> u32 {
    0
}

#[cfg(test)]
mod tests {
    use super::say_hi;

    #[test]
    fn it_works() {
        assert(say_hi() == 0, 'it works!');
    }
}
