import { Component, Input } from '@angular/core';
import { MessageState } from '../../core/ViewModels/MessageState';

@Component({
  selector: 'app-alert-message',
  standalone: true,
  imports: [],
  templateUrl: './alert-message.component.html',
  styleUrl: './alert-message.component.css'
})
export class AlertMessageComponent {
  @Input() message: MessageState = { message: '', state: true };


  changeMessage(Msg:string,etat:boolean){
    this.message.message = Msg;
    this.message.state = etat;
    // setTimeout(() => {
    //   this.message.message = '';
    // }, 10000);
  }

  isAlertVisible: boolean = false;

  hideAlert() {
    this.changeMessage('',false);
  }
}
