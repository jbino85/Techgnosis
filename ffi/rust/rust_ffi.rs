// rust_ffi.rs — Rust FFI for Ọ̀ṢỌ́VM
// Handles: Safety guards, memory protection, concurrency control

use std::sync::Mutex;
use std::collections::HashMap;

/// Reentrancy guard using mutex
static GUARD: Mutex<HashMap<String, bool>> = Mutex::new(HashMap::new());

/// Nonreentrant guard for critical sections
/// Prevents recursive calls to same function
#[no_mangle]
pub extern "C" fn oso_nonreentrant_guard(function_id: *const i8) -> bool {
    let c_str = unsafe { std::ffi::CStr::from_ptr(function_id) };
    let func_name = c_str.to_str().unwrap_or("unknown");
    
    let mut guard = GUARD.lock().unwrap();
    
    if *guard.get(func_name).unwrap_or(&false) {
        // Already executing
        return false;
    }
    
    guard.insert(func_name.to_string(), true);
    true
}

/// Release reentrancy guard
#[no_mangle]
pub extern "C" fn oso_release_guard(function_id: *const i8) {
    let c_str = unsafe { std::ffi::CStr::from_ptr(function_id) };
    let func_name = c_str.to_str().unwrap_or("unknown");
    
    let mut guard = GUARD.lock().unwrap();
    guard.insert(func_name.to_string(), false);
}

/// Memory-safe buffer operations
#[no_mangle]
pub extern "C" fn oso_safe_buffer_copy(
    src: *const u8,
    src_len: usize,
    dst: *mut u8,
    dst_len: usize,
) -> i32 {
    if src.is_null() || dst.is_null() {
        return -1;
    }
    
    if src_len > dst_len {
        return -2;  // Buffer overflow prevented
    }
    
    unsafe {
        std::ptr::copy_nonoverlapping(src, dst, src_len);
    }
    
    0  // Success
}

/// Bounds checking for array access
#[no_mangle]
pub extern "C" fn oso_bounds_check(index: usize, length: usize) -> bool {
    index < length
}

/// Type-safe integer conversion with overflow protection
#[no_mangle]
pub extern "C" fn oso_safe_int_conv(value: i64) -> Option<i32> {
    i32::try_from(value).ok()
}

/// Thread-safe counter for Aṣẹ tracking
pub struct AseCounter {
    count: Mutex<u64>,
}

impl AseCounter {
    pub fn new() -> Self {
        AseCounter {
            count: Mutex::new(0),
        }
    }
    
    pub fn increment(&self, amount: u64) -> u64 {
        let mut count = self.count.lock().unwrap();
        *count = count.saturating_add(amount);
        *count
    }
    
    pub fn get(&self) -> u64 {
        *self.count.lock().unwrap()
    }
}

#[no_mangle]
pub extern "C" fn oso_create_counter() -> *mut AseCounter {
    Box::into_raw(Box::new(AseCounter::new()))
}

#[no_mangle]
pub extern "C" fn oso_counter_increment(counter: *mut AseCounter, amount: u64) -> u64 {
    let counter = unsafe { &*counter };
    counter.increment(amount)
}

#[no_mangle]
pub extern "C" fn oso_counter_get(counter: *mut AseCounter) -> u64 {
    let counter = unsafe { &*counter };
    counter.get()
}

#[no_mangle]
pub extern "C" fn oso_destroy_counter(counter: *mut AseCounter) {
    if !counter.is_null() {
        unsafe {
            drop(Box::from_raw(counter));
        }
    }
}

/// Cryptographic hash validation (SHA-256)
#[no_mangle]
pub extern "C" fn oso_validate_hash(hash: *const u8, hash_len: usize) -> bool {
    if hash.is_null() || hash_len != 32 {
        return false;
    }
    
    // Basic validation: ensure not all zeros
    let hash_slice = unsafe { std::slice::from_raw_parts(hash, hash_len) };
    !hash_slice.iter().all(|&b| b == 0)
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_bounds_check() {
        assert!(oso_bounds_check(5, 10));
        assert!(!oso_bounds_check(10, 10));
        assert!(!oso_bounds_check(11, 10));
    }
    
    #[test]
    fn test_ase_counter() {
        let counter = AseCounter::new();
        assert_eq!(counter.get(), 0);
        
        counter.increment(100);
        assert_eq!(counter.get(), 100);
        
        counter.increment(50);
        assert_eq!(counter.get(), 150);
    }
}
