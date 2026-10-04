## 2024-10-04 - Network Manager Interface Health Checks
**Learning:** Sequential async operations for network availability checks created an O(n) latency trap when querying local network interfaces. This severely limits application responsiveness if there are multiple disconnected/timeout prone local interfaces.
**Action:** Replaced sequential loop with Promise.all to concurrently ping all interfaces, returning results in O(1) latency matching the single slowest interface instead of sum of all timeouts.
