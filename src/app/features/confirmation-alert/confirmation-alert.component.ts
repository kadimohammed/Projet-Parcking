import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageState } from '../../core/ViewModels/MessageState';

@Component({
  selector: 'app-confirmation-alert',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-alert.component.html',
  styleUrl: './confirmation-alert.component.css'
})
export class ConfirmationAlertComponent {
  @Input() message: string = "";
  @Output() confirmed = new EventEmitter<boolean>();  // Ajout d'un EventEmitter
  isAlertVisible: boolean = false;

  changeMessage(Msg:string)
  {
    this.message = Msg;
    // setTimeout(() => {
    //   this.message.message = '';
    // }, 10000);
  }

  hideAlert() {
    this.changeMessage('');
    this.confirmed.emit(false)
  }

  confirmAction() {
    this.changeMessage('');
    this.confirmed.emit(true);  // Emet l'événement quand l'utilisateur confirme
  }


}
