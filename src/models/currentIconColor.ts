

export class CurrentIconColor {
    private observers: Observer[] = []; // Lista de observadores
    private state: string = "#000000"; // Estado que se está observando
  
    // Método para agregar un observador
    public addObserver(observer: Observer): void {
      this.observers.push(observer);
    }
  
    // Método para eliminar un observador
    public removeObserver(observer: Observer): void {
      const index = this.observers.indexOf(observer);
      if (index !== -1) {
        this.observers.splice(index, 1);
      }
    }
  
    // Método para notificar a todos los observadores
    private notifyObservers(): void {
      for (const observer of this.observers) {
        observer.update(this.state);
      }
    }
  
    // Método para cambiar el estado y notificar a los observadores
    public setState(newState: any): void {
      this.state = newState;
      this.notifyObservers(); // Notificar a los observadores
    }
  
    // Método para obtener el estado actual
    public getState(): string {
      return this.state;
    }
  }