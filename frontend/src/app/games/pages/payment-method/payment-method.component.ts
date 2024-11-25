import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-method-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './payment-method.component.html',
  styles: ``,
})
export class PaymentMethodPageComponent {
  paymentData = {
    paymentType: '',
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
    saveInfo: false,
  };

  billingData = {
    firstName: '',
    lastName: '',
    city: '',
    billingAddress: '',
    billingAddress2: '',
    zipCode: '',
    country: 'Costa Rica',
    phoneNumber: '',
  };

  onSubmit() {
    console.log('Payment Data:', this.paymentData);
    console.log('Billing Data:', this.billingData);
    alert('Form submitted successfully!');
  }
}
