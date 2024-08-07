import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  angle: number;
}

@Injectable({
  providedIn: 'root'
})
export class DrawingService {
  private rectanglesSource = new BehaviorSubject<Rectangle[]>([]);
  rectangles$ = this.rectanglesSource.asObservable();

  private historySource = new BehaviorSubject<Rectangle[][]>([]);
  private historyIndexSource = new BehaviorSubject<number>(-1);

  addRectangle(rect: Rectangle) {
    const currentRectangles = this.rectanglesSource.value;
    this.rectanglesSource.next([...currentRectangles, rect]);
    this.saveToHistory();
  }

  updateRectangles(rectangles: Rectangle[]) {
    this.rectanglesSource.next(rectangles);
  }

  saveToHistory() {
    const currentHistory = this.historySource.value;
    const currentIndex = this.historyIndexSource.value;
    const newHistory = currentHistory.slice(0, currentIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(this.rectanglesSource.value)));
    this.historySource.next(newHistory);
    this.historyIndexSource.next(currentIndex + 1);
  }

  undo() {
    const currentIndex = this.historyIndexSource.value;
    if (currentIndex > 0) {
      this.historyIndexSource.next(currentIndex - 1);
      const newRectangles = JSON.parse(JSON.stringify(this.historySource.value[currentIndex - 1]));
      this.rectanglesSource.next(newRectangles);
    }
  }

  getRectangles(): Rectangle[] {
    return this.rectanglesSource.value;
  }
}