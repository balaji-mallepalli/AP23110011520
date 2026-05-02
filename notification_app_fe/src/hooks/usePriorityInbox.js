import { useState, useEffect, useCallback } from "react";
import { fetchAllNotifications } from "../api/notifications";
import { Log } from "logging-middleware";

const TYPE_WEIGHTS = { Placement: 3, Result: 2, Event: 1 };

function computeScore(notification) {
  const weight = TYPE_WEIGHTS[notification.Type] || 0;
  const timestampMs = new Date(notification.Timestamp).getTime();
  return weight * 1e13 + timestampMs;
}

class MinHeap {
  constructor(capacity) {
    this.capacity = capacity;
    this.heap = [];
  }

  get size() { return this.heap.length; }

  insert(notification, score) {
    if (this.size < this.capacity) {
      this.heap.push({ notification, score });
      this._bubbleUp(this.size - 1);
    } else if (score > this.heap[0].score) {
      this.heap[0] = { notification, score };
      this._siftDown(0);
    }
  }

  extractSorted() {
    const sorted = [];
    while (this.size > 0) {
      sorted.push(this.heap[0].notification);
      const last = this.heap.pop();
      if (this.size > 0) { this.heap[0] = last; this._siftDown(0); }
    }
    sorted.reverse();
    return sorted;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parentIdx = Math.floor((index - 1) / 2);
      if (this.heap[index].score < this.heap[parentIdx].score) {
        [this.heap[index], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[index]];
        index = parentIdx;
      } else break;
    }
  }

  _siftDown(index) {
    const length = this.size;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      if (left < length && this.heap[left].score < this.heap[smallest].score) smallest = left;
      if (right < length && this.heap[right].score < this.heap[smallest].score) smallest = right;
      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        index = smallest;
      } else break;
    }
  }
}

export function usePriorityInbox(topN = 10) {
  const [priorityNotifications, setPriorityNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAndRank = useCallback(async () => {
    setLoading(true);
    setError(null);
    Log("frontend", "info", "hook", `usePriorityInbox fetching — topN=${topN}`);

    try {
      const allNotifications = await fetchAllNotifications();
      const heap = new MinHeap(topN);

      for (const notification of allNotifications) {
        heap.insert(notification, computeScore(notification));
      }

      const ranked = heap.extractSorted();
      setPriorityNotifications(ranked);
      Log("frontend", "info", "hook", `Ranked ${ranked.length} from ${allNotifications.length} total`);
    } catch (err) {
      setError(err.message);
      Log("frontend", "error", "hook", `usePriorityInbox error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [topN]);

  useEffect(() => { fetchAndRank(); }, [fetchAndRank]);

  return { priorityNotifications, loading, error, refetch: fetchAndRank };
}
