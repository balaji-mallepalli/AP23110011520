import { Log } from "logging-middleware";

// Priority weights: Placement > Result > Event
const TYPE_WEIGHTS = {
  Placement: 3,
  Result:    2,
  Event:     1,
};

// Combine type weight and timestamp into one comparable score
function computeScore(notification) {
  const weight = TYPE_WEIGHTS[notification.Type] || 0;
  const timestampMs = new Date(notification.Timestamp).getTime();
  return weight * 1e13 + timestampMs;
}

// Fixed-capacity MinHeap — retains only the top-K highest-scored items
class MinHeap {
  constructor(capacity) {
    this.capacity = capacity;
    this.heap = [];
  }

  get size() {
    return this.heap.length;
  }

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
      if (this.size > 0) {
        this.heap[0] = last;
        this._siftDown(0);
      }
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
      } else {
        break;
      }
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
      } else {
        break;
      }
    }
  }
}

// Select top N highest-priority notifications using a MinHeap
export function getTopPriorityNotifications(notifications, topN) {
  Log("backend", "info", "service", `Ranking top ${topN} notifications`);

  const heap = new MinHeap(topN);

  for (const notification of notifications) {
    const score = computeScore(notification);
    heap.insert(notification, score);
  }

  Log("backend", "info", "service", "MinHeap processing complete");

  const topNotifications = heap.extractSorted();

  Log("backend", "info", "service", `Ranked ${topNotifications.length} notifications`);
  return topNotifications;
}
