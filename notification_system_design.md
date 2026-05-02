# Stage 1

## Priority Inbox Algorithm — System Design

### Overview

The Priority Inbox selects the **top N most important unread notifications** from a stream of campus notifications. Importance is determined by a two-factor scoring system: **type weight** and **recency**.

---

### Priority Scoring Approach

Each notification receives a composite score computed as:

```
score = type_weight × 10¹³ + unix_timestamp_ms
```

#### Type Weights

| Notification Type | Weight | Rationale |
|-------------------|--------|-----------|
| **Placement**     | 3      | Career-critical — students cannot afford to miss these |
| **Result**        | 2      | Academic outcomes require timely attention |
| **Event**         | 1      | Informational — important but less time-sensitive |

The multiplier `10¹³` ensures the type weight **always dominates** the recency component. Within the same type, the unix timestamp in milliseconds acts as a natural tie-breaker — newer notifications score higher.

#### Example

```
Placement @ 2026-04-22 17:51:30  →  3 × 10¹³ + 1745343090000 = 31745343090000
Result    @ 2026-04-22 17:51:30  →  2 × 10¹³ + 1745343090000 = 21745343090000
Event     @ 2026-04-23 10:00:00  →  1 × 10¹³ + 1745402400000 = 11745402400000
```

Even though the Event is newer, its lower type weight keeps it below the Placement and Result.

---

### Approach 1: Sort-Based (Batch Processing)

For a one-time batch of notifications, we can simply sort the entire array by the composite score in descending order and slice the top N.

```
sortedNotifications = notifications.sort((a, b) => score(b) - score(a))
topN = sortedNotifications.slice(0, N)
```

**Time Complexity:** `O(N log N)` — where N is the total number of notifications.

**Space Complexity:** `O(N)` — we hold all notifications in memory.

This is the simplest approach and works well when:
- The full dataset is available upfront
- N is close to the total number of notifications
- The dataset fits comfortably in memory

---

### Approach 2: Min-Heap of Size K (Streaming / Live Data)

For **streaming or live data** where notifications arrive continuously, a Min-Heap of fixed capacity K (where K = desired top-K count) is significantly more efficient.

#### How It Works

1. **Initialize** an empty Min-Heap with capacity K.
2. For each incoming notification:
   - Compute its priority score.
   - If the heap has fewer than K items, insert directly.
   - If the heap is full and the new item's score exceeds the heap's minimum (root), **replace the root** and restore the heap property.
   - Otherwise, discard the item — it's not in the top K.
3. After processing all items, **extract** the heap contents in sorted order.

#### Complexity Analysis

| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| Insert one item | `O(log K)` | Heap insertion/replacement |
| Process N items | `O(N log K)` | Each of N items triggers at most one heap operation |
| Extract sorted top K | `O(K log K)` | Drain the heap |
| **Total** | **`O(N log K)`** | Dominates when K << N |
| **Space** | **`O(K)`** | Only K items in memory at any time |

#### Why This Beats Sorting

When K is much smaller than N (e.g., top 10 from 10,000 notifications):

```
Sort-based:   O(N log N) = O(10000 × 13.3) ≈ 133,000 operations
Min-Heap:     O(N log K) = O(10000 × 3.3)  ≈  33,000 operations
```

The heap approach is **~4× faster** and uses **O(K)** memory instead of **O(N)**.

#### Streaming Advantage

The Min-Heap naturally supports **live/streaming** scenarios:
- New notifications can be inserted as they arrive without re-sorting
- The heap always contains the current top-K at any point in time
- No need to buffer the entire dataset before processing
- Memory usage stays bounded at O(K) regardless of how many notifications arrive

---

### Implementation Details

Our implementation uses a **binary Min-Heap** stored as a flat array:

- **Parent index**: `Math.floor((i - 1) / 2)`
- **Left child**: `2i + 1`
- **Right child**: `2i + 2`

Key operations:
- `_bubbleUp(index)` — restores heap property after insertion
- `_siftDown(index)` — restores heap property after root replacement
- `extractSorted()` — drains the heap into a reversed array for highest-first order

---

### Production Suitability

This algorithm is production-suitable for the following reasons:

1. **Deterministic scoring** — The composite score formula produces consistent, reproducible rankings with no ambiguity.

2. **O(K) memory footprint** — For a campus notification system where K (top-10 or top-20) is tiny relative to total notifications, memory usage is negligible.

3. **Streaming-ready** — The heap naturally accommodates real-time notification feeds without requiring batch re-computation.

4. **No external dependencies** — The implementation uses only native JavaScript data structures, eliminating dependency risk.

5. **Extensible** — Additional priority factors (e.g., user department, deadline proximity) can be incorporated into the scoring function without changing the heap logic.

6. **Graceful degradation** — If the scoring function encounters an unknown notification type, it defaults to weight 0, ensuring the system continues operating rather than crashing.
