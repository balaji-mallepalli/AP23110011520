/**
 * Priority Inbox Module
 *
 * Implements a Min-Heap based priority ranking algorithm for campus
 * notifications. Notifications are scored by:
 *   1. Type weight: Placement (3) > Result (2) > Event (1)
 *   2. Recency: newer timestamps win when weights are equal
 *
 * The Min-Heap of fixed size N ensures O(N log K) performance for
 * selecting the top-K notifications from a stream of N items.
 */

import { Log } from "logging-middleware";

/* ------------------------------------------------------------------ */
/*  Type weight mapping                                                */
/* ------------------------------------------------------------------ */

/**
 * Priority weights per notification type.
 * Higher weight = more important.
 */
const TYPE_WEIGHTS = {
  Placement: 3,
  Result:    2,
  Event:     1,
};

/* ------------------------------------------------------------------ */
/*  Scoring function                                                   */
/* ------------------------------------------------------------------ */

/**
 * Compute a single numeric priority score for a notification.
 *
 * Strategy: combine type weight and timestamp into one comparable number.
 * We multiply the type weight by a large constant (10^13) so it always
 * dominates, then add the unix timestamp in milliseconds for recency
 * tie-breaking within the same weight class.
 *
 * @param {{Type: string, Timestamp: string}} notification
 * @returns {number} A higher score means higher priority
 */
function computeScore(notification) {
  const weight = TYPE_WEIGHTS[notification.Type] || 0;
  const timestampMs = new Date(notification.Timestamp).getTime();

  // Weight dominates; timestamp breaks ties within the same type
  return weight * 1e13 + timestampMs;
}

/* ------------------------------------------------------------------ */
/*  Min-Heap implementation                                            */
/* ------------------------------------------------------------------ */

/**
 * A fixed-capacity Min-Heap that keeps only the top-K highest-scored items.
 *
 * When a new item is inserted and the heap is at capacity:
 *   - If the new item's score is higher than the min, replace the min
 *   - Otherwise discard the new item
 *
 * This gives O(log K) per insertion, and O(N log K) overall to process
 * N notifications and extract the top K.
 */
class MinHeap {
  /**
   * @param {number} capacity — Maximum number of items to retain (K)
   */
  constructor(capacity) {
    this.capacity = capacity;
    /** @type {Array<{notification: object, score: number}>} */
    this.heap = [];
  }

  /** Number of items currently in the heap */
  get size() {
    return this.heap.length;
  }

  /**
   * Insert an item. If over capacity, evict the smallest item
   * (which is less important) so only the top-K remain.
   *
   * @param {object} notification — The raw notification object
   * @param {number} score — Pre-computed priority score
   */
  insert(notification, score) {
    if (this.size < this.capacity) {
      // Heap has room — just push and bubble up
      this.heap.push({ notification, score });
      this._bubbleUp(this.size - 1);
    } else if (score > this.heap[0].score) {
      // New item beats the current minimum — replace root and sift down
      this.heap[0] = { notification, score };
      this._siftDown(0);
    }
    // Otherwise the new item is not in the top-K — discard silently
  }

  /**
   * Extract all items sorted from highest to lowest priority.
   * Drains the heap in the process.
   *
   * @returns {Array<object>} Sorted notifications (highest priority first)
   */
  extractSorted() {
    const sorted = [];

    while (this.size > 0) {
      // The root is always the minimum remaining item
      sorted.push(this.heap[0].notification);

      // Move last element to root and sift down
      const last = this.heap.pop();
      if (this.size > 0) {
        this.heap[0] = last;
        this._siftDown(0);
      }
    }

    // We extracted from smallest to largest; reverse for highest-first
    sorted.reverse();
    return sorted;
  }

  /* ---------- Internal heap operations ---------- */

  /** Restore heap property upward after an insertion */
  _bubbleUp(index) {
    while (index > 0) {
      const parentIdx = Math.floor((index - 1) / 2);
      if (this.heap[index].score < this.heap[parentIdx].score) {
        [this.heap[index], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[index]];
        index = parentIdx;
      } else {
        break;
      }
    }
  }

  /** Restore heap property downward after a replacement */
  _siftDown(index) {
    const length = this.size;

    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < length && this.heap[left].score < this.heap[smallest].score) {
        smallest = left;
      }
      if (right < length && this.heap[right].score < this.heap[smallest].score) {
        smallest = right;
      }
      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        index = smallest;
      } else {
        break;
      }
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Select the top N highest-priority notifications using a Min-Heap.
 *
 * @param {Array<{ID: string, Type: string, Message: string, Timestamp: string}>} notifications
 * @param {number} topN — How many top notifications to return
 * @returns {Array<{ID: string, Type: string, Message: string, Timestamp: string}>}
 */
export function getTopPriorityNotifications(notifications, topN) {
  Log("backend", "info", "service", `Starting priority ranking for top ${topN} notifications`);

  const heap = new MinHeap(topN);

  for (const notification of notifications) {
    const score = computeScore(notification);
    heap.insert(notification, score);
  }

  Log("backend", "info", "service", `Min-Heap processing complete — extracting sorted results`);

  const topNotifications = heap.extractSorted();

  Log(
    "backend", "info", "service",
    `Priority ranking complete — ${topNotifications.length} notifications selected`
  );

  return topNotifications;
}
