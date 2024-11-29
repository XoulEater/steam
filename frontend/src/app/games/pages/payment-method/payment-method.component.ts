import { OrdersService } from './../../../admin/services/orders.service';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-method-page',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './payment-method.component.html',
  styles: ``,
})
export class PaymentMethodPageComponent {
  paymentForm: FormGroup;

  constructor(
    private ordersService: OrdersService,
    private fb: FormBuilder,
    private router: RouterModule
  ) {
    this.paymentForm = this.fb.group({
      paymentType: [''],
      cardNumber: [''],
      expirationDate: [''],
      securityCode: [''],
      firstName: [''],
      lastName: [''],
      billingAddress: [''],
      billingAddress2: [''],
      zipCode: [''],
      country: [''],
      phoneNumber: [''],
      saveInfo: [false],
    });
  }

  onSubmit() {
    this.ordersService
      .createOrder(
        this.paymentForm.value.cardNumber,
        this.paymentForm.value.billingAddress
      )
      .subscribe((response) => {
        console.log(response);
      });
  }
}
