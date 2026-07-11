/**
 * EventHub Custom Binary Max-Heap Priority Queue Implementation
 * Written natively to satisfy university technical criteria.
 */
class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  // Helper methods to calculate parent and child indices using heap math formulas
  getParentIndex(i) { return Math.floor((i - 1) / 2); }
  getLeftChildIndex(i) { return 2 * i + 1; }
  getRightChildIndex(i) { return 2 * i + 2; }

  /**
   * Insert a new attendee into the waitlist heap matrix
   * @param {Object} item - An object containing { userId, priorityScore, joinedAt }
   */
  insert(item) {
    this.heap.push(item);
    this.heapifyUp(this.heap.length - 1);
  }

  /**
   * Remove and return the highest priority attendee from the heap
   * @returns {Object} The attendee item with the highest priority score
   */
  extractMax() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const max = this.heap[0];
    // Move the last element to the top, then sink it down to its correct spot
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    
    return max;
  }

  /**
   * Bubble up the last element until it reaches its correct priority level
   */
  heapifyUp(index) {
    while (
      index > 0 && 
      this.heap[this.getParentIndex(index)].priorityScore < this.heap[index].priorityScore
    ) {
      const parentIdx = this.getParentIndex(index);
      // Swap elements using JavaScript array destructuring
      [this.heap[parentIdx], this.heap[index]] = [this.heap[index], this.heap[parentIdx]];
      index = parentIdx;
    }
  }

  /**
   * Sink down an element until it settles in its correct priority level
   */
  heapifyDown(index) {
    let maxIndex = index;
    const length = this.heap.length;
    const left = this.getLeftChildIndex(index);
    const right = this.getRightChildIndex(index);

    // Compare priority score with left child
    if (left < length && this.heap[left].priorityScore > this.heap[maxIndex].priorityScore) {
      maxIndex = left;
    }

    // Compare priority score with right child
    if (right < length && this.heap[right].priorityScore > this.heap[maxIndex].priorityScore) {
      maxIndex = right;
    }

    // If a child has a higher priority, swap and continue sinking down recursively
    if (index !== maxIndex) {
      [this.heap[index], this.heap[maxIndex]] = [this.heap[maxIndex], this.heap[index]];
      this.heapifyDown(maxIndex);
    }
  }

  /**
   * Return the current underlying flat array structure
   */
  getHeap() {
    return this.heap;
  }
}

module.exports = PriorityQueue;